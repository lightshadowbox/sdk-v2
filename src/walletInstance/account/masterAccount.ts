import _ from 'lodash';
import { generateMasterKey } from '@src/services/key/generator';
import bn from 'bn.js';
import BaseAccount from './baseAccount';
import AccountModel from '@src/models/account/account';
import MasterAccountModel from '@src/models/account/masterAccount';
import { generateChildKeyData, deserializePrivateKeyBytes, base58CheckDeserialize } from '@src/services/key/keyWallet';
import KeyWalletModel from '@src/models/key/keyWallet';
import { getShardIDFromLastByte } from '@src/utils/common';
import Account from './account';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import { getKeySetFromPrivateKeyBytes } from '@src/services/key/accountKeySet';
import PrivateKeyModel from '@src/models/key/privateKey';

const DEFAULT_MASTER_ACCOUNT_NAME = 'MASTER_ACCOUNT';

interface MasterAccountInterface extends MasterAccountModel {};

class MasterAccount extends BaseAccount implements MasterAccountInterface {
  child: AccountModel[];

  constructor(walletSeed: Uint8Array, name: string = DEFAULT_MASTER_ACCOUNT_NAME) {
    super(name);

    this.child = [];
    this.key = null;

    this.init(walletSeed);
  }

  init(walletSeed: Uint8Array) {
    this.key = generateMasterKey(walletSeed);
    this.serializeKeys();
    this.addAccount('Account 0');
  }

  addAccount(name: string, shardId?: number) {
    const lastChildAccountIndex = _.findLastIndex(this.child, account => !account.isImport && !!account.key.childNumber);
    const lastChildAccount = lastChildAccountIndex !== -1 && this.child[lastChildAccountIndex];
    let newIndex = lastChildAccount ? new bn(lastChildAccount.key.childNumber).add(new bn(1)).toNumber() : 0;
    let keyData, lastByte;
    
    do {
      keyData = generateChildKeyData(newIndex, this.key.depth, this.key.chainCode);
      const publicKeyBytes = keyData.keySet.paymentAddress.publicKeyBytes;

      lastByte = publicKeyBytes[publicKeyBytes.length - 1];
      newIndex += 1;
    } while(typeof shardId === 'number' && getShardIDFromLastByte(lastByte) !== shardId);

    const childAccountKeyWallet = new KeyWalletModel();

    childAccountKeyWallet.chainCode = keyData.chainCode;
    childAccountKeyWallet.childNumber = keyData.childNumber;
    childAccountKeyWallet.depth = keyData.depth;
    childAccountKeyWallet.keySet = keyData.keySet;

    const account = new Account(name, childAccountKeyWallet, false);
    this.child.push(account);

    return account;
  }

  removeAccount(name: string) {
    _.remove(this.child, account => account.name === name);
  }

  getAccounts() {
    return this.child;
  }

  importAccount(name: string, privateKey: string) {
    const { key, type } = base58CheckDeserialize(privateKey);
    if (type === 'PRIVATE_KEY') {
      const privateKeyData = <{[key: string]: any}>key;
      const childAccountKeyWallet = new KeyWalletModel();
      const keySet = getKeySetFromPrivateKeyBytes((<PrivateKeyModel>privateKeyData.privateKey).privateKeyBytes);
      
      childAccountKeyWallet.chainCode = <Uint8Array>privateKeyData.chainCode;
      childAccountKeyWallet.childNumber = <Uint8Array>privateKeyData.childNumber;
      childAccountKeyWallet.depth = <number>privateKeyData.depth;
      childAccountKeyWallet.keySet = keySet;
      
      const account = new Account(name, childAccountKeyWallet, true);
      this.child.push(account);

      return account;
    } else {
      throw new Error('Import account failed, private key is invalid');
    }
  }
}

export default MasterAccount;