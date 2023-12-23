## Logical views {#logicalviews}

A <dfn>logical view</dfn> (`rml:LogicalView`) is a logical source whose contents are the result of creating fields with data from its logical source.

A [=logical view=] (`rml:LogicalView`) is represented by a resource that MUST contain:
- exactly one logical source property (`rml:logicalSource`), whose value is a [logical source](https://kg-construct.github.io/rml-io/spec/docs/#source-vocabulary) (`rml:LogicalSource`),
- at least one field property (`rml:field`), whose values is a [=field=] (`rml:Field`).

A [=logical view=] (`rml:LogicalView`) MAY contain:
- one or more join properties (`rml:leftJoin`, `rml:innerJoin`) to describe a [=join=] operation (`rml:Join`) with another [=Logical View=].

A [=logical view=] (`rml:LogicalView`) has an implicit default reference formulation (`rml:referenceFormulation`) and logical iterator (`rml:iterator`), which MUST not be overwritten. 

| Property             | Domain             | Range               |
|----------------------|--------------------|---------------------|
| `rml:logicalSource`  | `rml:LogicalView`  | `rml:LogicalSource` |
| `rml:field`          | `rml:LogicalView`  | `rml:Field`         |
| `rml:leftJoin`       | `rml:LogicalView`  | `rml:Join`          |
| `rml:innerJoin`      | `rml:LogicalView`  | `rml:Join`          |
