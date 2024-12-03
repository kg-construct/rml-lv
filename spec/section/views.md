## Logical views {#logicalviews}

A <dfn>logical view</dfn> (`rml:LogicalView`) is a type of <a data-cite="RML-Core##dfn-logical-source">logical source</a> that is derived from another <a data-cite="RML-Core##dfn-logical-source">logical source</a> by defining [=fields=] with data from said <a data-cite="RML-Core##dfn-logical-source">logical source</a>.

A [=logical view=] (`rml:LogicalView`) is represented by a resource that MUST contain:
- exactly one view on property (`rml:viewOn`), whose value is a <a data-cite="RML-Core##dfn-logical-source">logical source</a> (`rml:LogicalSource`),
- at least one field property (`rml:field`), whose value is a [=field=] (`rml:Field`).
- zero or more join properties (`rml:leftJoin`, `rml:innerJoin`), whose value is a [=logical view join=](`rml:LogicalViewJoin`).

A [=logical view=] (`rml:LogicalView`) has an implicit default <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a>(`rml:referenceFormulation`) and <a data-cite="RML-Core##dfn-iterator">logical iterator</a>  (`rml:iterator`), which MUST not be overwritten. 

| Property        | Domain                           | Range                 |
|-----------------|----------------------------------|-----------------------|
| `rml:viewOn`    | `rml:LogicalView`                | `rml:LogicalSource`   |
| `rml:field`     | `rml:LogicalView` or `rml:Field` | `rml:Field`           |
| `rml:leftJoin`  | `rml:LogicalView`                | `rml:LogicalViewJoin` |
| `rml:innerJoin` | `rml:LogicalView`                | `rml:LogicalViewJoin` |
