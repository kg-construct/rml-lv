## Logical views {#logicalviews}

A <dfn>logical view</dfn> is a type of <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a> that is derived from another <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a> by defining [=fields=] with data from said <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a>.

A [=logical view=] (`rml:LogicalView`) is represented by a resource that MUST contain:
- exactly one view on property (`rml:viewOn`), whose value is a <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a> (`rml:AbstractLogicalSource`),
- at least one field property (`rml:field`), whose value is a [=field=] (`rml:Field`).
- zero or more join properties (`rml:leftJoin`, `rml:innerJoin`), whose value is a [=logical view join=] (`rml:LogicalViewJoin`).

A [=logical view=] (`rml:LogicalView`) has an implicit default <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> (`rml:referenceFormulation`) and <a data-cite="RML-Core##dfn-iterator">logical iterator</a>  (`rml:iterator`), which MUST not be overwritten.

| Property        | Domain                           | Range                 |
|-----------------|----------------------------------|-----------------------|
| `rml:viewOn`    | `rml:LogicalView`                | `rml:LogicalSource`   |
| `rml:field`     | `rml:LogicalView` or `rml:Field` | `rml:Field`           |
| `rml:leftJoin`  | `rml:LogicalView`                | `rml:LogicalViewJoin` |
| `rml:innerJoin` | `rml:LogicalView`                | `rml:LogicalViewJoin` |


### Logical view iterator {#logicalviewiterator}

The <a data-cite="RML-Core##dfn-iterator">logical iterator</a> of a [=logical view=] produces a <dfn>logical view iteration sequence</dfn>, i.e. an ordered sequence of sets of key-value pairs, where each key is a string and each value a [=record=] or a positive integer.
A <dfn>record</dfn> is either a <a data-cite="RML-Core#dfn-iteration">logical iteration</a> or one element of an <a data-cite="RML-Core#https://kg-construct.github.io/rml-core/spec/docs/#dfn-expression-evaluation-result">expression evaluation result</a>.
A <dfn>record key</dfn> has a [=record=] as value. 
An <dfn>index key</dfn> has a positive integer as value, indicating the position of the corresponding record in  the sequence of <a data-cite="RML-Core#dfn-iteration">logical iterations</a> or in the <a data-cite="RML-Core#https://kg-construct.github.io/rml-core/spec/docs/#dfn-expression-evaluation-result">expression evaluation result</a> from which it is derived.
Each set of key-value pairs represents a <a data-cite="RML-Core#dfn-iteration">logical iteration</a> of the [=logical view=] , called a <dfn>logical view iteration</dfn>.
A [=logical view iteration sequence=] MUST have a finite set of keys that appear in each [=logical view iteration=].
In any particular [=logical view iteration=], the value of a key MAY be a null value.

Each [=logical view iteration=] has at least following keys: 
- An [=index key=] `#` with as corresponding values the position of the current [=logical view iteration=] in the sequence defined by the <a data-cite="RML-Core#dfn-iterator">logical iterator</a> of the <a data-cite="RML-Core#dfn-abstract-logical-source">abstract logical source</a> of the [=logical view=].
- A [=record key=] `<it>` with as corresponding values the <a data-cite="RML-Core##dfn-iteration">logical iterations</a> produced by the <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a> of the [=logical view=].

The other key-value pairs are defined by the [=fields=] of the [=logical view=].
