## Logical views {#logicalviews}

A <dfn>logical view</dfn> (`rml:LogicalView`) is a type of logical source that is derived from another logical source by defining fields with data from said logical source.

A [=logical view=] (`rml:LogicalView`) is represented by a resource that MUST contain:
- exactly one logical source property (`rml:onLogicalSource`), whose value is a [logical source](https://kg-construct.github.io/rml-io/spec/docs/#source-vocabulary) (`rml:LogicalSource`),
- at least one field property (`rml:field`), whose value is a [=field=] (`rml:Field`).
- zero or more join properties (`rml:leftJoin`, `rml:innerJoin`) to describe a [=join=] operation (`rml:Join`) with another [=Logical View=].

A [=logical view=] (`rml:LogicalView`) has an implicit default reference formulation (`rml:referenceFormulation`) and logical iterator (`rml:iterator`), which MUST not be overwritten. 

| Property              | Domain             | Range                 |
|-----------------------|--------------------|-----------------------|
| `rml:onLogicalSource` | `rml:LogicalView`  | `rml:LogicalSource`   |
| `rml:field`           |                    | `rml:Field`           |
| `rml:leftJoin`        | `rml:LogicalView`  | `rml:LogicalViewJoin` |
| `rml:innerJoin`       | `rml:LogicalView`  | `rml:LogicalViewJoin` |
