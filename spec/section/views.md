## Logical views {#logicalviews}

A <dfn>logical view</dfn> (`rml:LogicalView`) is a type of <!-- TODO link to logical source definition in IO? raise issue -->logical source that is derived from another <!-- TODO core or io, dependent on https://github.com/kg-construct/rml-lv/issues/7 and https://github.com/kg-construct/rml-lv/issues/14-->logical source by defining [=fields=] with data from said <!-- TODO io -->logical source.

A [=logical view=] (`rml:LogicalView`) is represented by a resource that MUST contain:
- exactly one <!-- TODO core or io, dependent on https://github.com/kg-construct/rml-lv/issues/7 and https://github.com/kg-construct/rml-lv/issues/14-->source property (`rml:source`), whose value is a <!-- TODO core or io, dependent on https://github.com/kg-construct/rml-lv/issues/7 and https://github.com/kg-construct/rml-lv/issues/14-->[logical source](https://kg-construct.github.io/rml-io/spec/docs/#source-vocabulary) (`rml:LogicalSource`),
- at least one field property (`rml:field`), whose value is a [=field=] (`rml:Field`).
- zero or more join properties (`rml:leftJoin`, `rml:innerJoin`) to describe a [=logical view join=] operation (`rml:LogicalViewJoin`) with another [=Logical View=].

A [=logical view=] (`rml:LogicalView`) has an implicit default <!-- TODO core or io, dependent on https://github.com/kg-construct/rml-lv/issues/7 and https://github.com/kg-construct/rml-lv/issues/14-->reference formulation (`rml:referenceFormulation`) and logical iterator (`rml:iterator`), which MUST not be overwritten. 

| Property              | Domain             | Range                 |
|-----------------------|--------------------|-----------------------|
| `rml:onLogicalSource` | `rml:LogicalView`  | `rml:LogicalSource`   |
| `rml:field`           |                    | `rml:Field`           |
| `rml:leftJoin`        | `rml:LogicalView`  | `rml:LogicalViewJoin` |
| `rml:innerJoin`       | `rml:LogicalView`  | `rml:LogicalViewJoin` |
