declare function isPaymentAddress(paymentAddrStr: string): boolean;
declare class Validator {
    value: any;
    label: string;
    isRequired: boolean;
    constructor(label: string, value: any);
    _throwError(message: string): void;
    _isDefined(): boolean;
    _onCondition(condition: Function, message: string): this;
    required(message?: string): this;
    string(message?: string): this;
    boolean(message?: string): this;
    number(message?: string): this;
    array(message?: string): this;
    inList(list: any[], message?: string): this;
    intergerNumber(message?: string): this;
    paymentAddress(message?: string): this;
    privateKey(message?: string): this;
    shardId(message?: string): this;
    accountWallet(message?: string): this;
    /**
     *
     * @param {number} value amount in nano (must be an integer number)
     * @param {string} message error message
     */
    amount(message?: string): this;
    receivers(message?: string): void;
}
//# sourceMappingURL=validator.d.ts.map