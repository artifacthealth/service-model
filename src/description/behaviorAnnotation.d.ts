/**
 * Describes a behavior that can be applied to a contract or operation using an annotation.
 */
export interface BehaviorAnnotation {

    /**
     * The name of the contract that is the target of the behavior annotation. This is needed for [[OperationBehavior]] and
     * [[ContractBehavior]] classes that may be specified as attributes on services when the service has more than one
     * contract defined.
     */
    contract: string;
}
