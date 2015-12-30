interface BehaviorAttribute {

    /**
     * The name of the contract that is the target of the behavior attribute. This is needed for OperationBehavior and
     * ContractBehavior classes that may be specified as attributes on services when the service has more than one
     * contract defined.
     */
    contract: string;
}

export = BehaviorAttribute;