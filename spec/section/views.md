## RML Logical Views {#logicalviews}


A <dfn>Logical View</dfn> (`rml:LogicalView`) is a logical source whose contents are the result of creating fields with data from its logical source.

A [=Logical View=] (`rml:LogicalView`) is represented by a resource that MUST contain:
- exactly one logical source property (`rml:logicalSource`), whose value is a [logical source](https://kg-construct.github.io/rml-io/spec/docs/#source-vocabulary) (`rml:LogicalSource`),
- at least one field property (`rml:field`), whose values is a [=field=] (`rml:Field`).

A [=Logical View=] (`rml:LogicalView`) MAY contain:
- one or more join properties (`rml:leftJoin`, `rml:innerJoin`) to describe a [=join=] operation (`rml:Join`) with another [=Logical View=].


| Property        | Domain             | Range               |
|-----------------|--------------------|---------------------|
| `rml:source`    | `rml:LogicalView`  | `rml:LogicalSource` |
| `rml:field`     | `rml:LogicalView`  | `rml:Field`         |
| `rml:leftJoin`  | `rml:LogicalView`  | `rml:Join`          |
| `rml:innerJoin` | `rml:LogicalView`  | `rml:Join`          |
