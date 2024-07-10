## Problem {#problem}

*This section is non-normative.*

This module aims to resolve challenges such as handling hierarchy of nested data,
more flexible joining (also across data hierarchies), 
and handling data sources that mix source formats.

### Nested data structures

References to nested data structures, like JSON or XML, may return multiple values. 
These values can be composite: they may again contain multiple values. 
[RML-Core](https://kg-construct.github.io/rml-core/spec/docs/) defines mapping constructs that produce results by combining the results of other mapping constructs in a specific order. 
For example, a [triples map](https://kg-construct.github.io/rml-core/spec/docs/#dfn-triples-map) combines the results of a [subject map](https://kg-construct.github.io/rml-core/spec/docs/#dfn-subject-map)
and a [predicate-object map](https://kg-construct.github.io/rml-core/spec/docs/#dfn-subject-map) in that order. 
Another example is a [template expression](https://kg-construct.github.io/rml-core/spec/docs/#dfn-subject-map), 
which combines character strings and zero or more [reference expressions](https://kg-construct.github.io/rml-core/spec/docs/#dfn-reference-expression)
in declared order.
When mapping constructs produce multiple results, the combining mapping constructs will apply an [n-ary Cartesian product](https://w3id.org/rml/core/spec\#dfn-n-ary-cartesian-product) over the sets of results, 
maintaining the order of the mapping constructs.
In the case of nested data structures, this may cause the generation of results that do not match the source hierarchy, 
i.e. do not follow the root-to-leaf paths in the source data, since values are combined irrespective of it.

Furthermore, there is varying expressiveness in data source expression and query languages, 
and many languages have limited support for hierarchy traversal.
For example, JSONPath has no operator to refer to an ancestor in the document hierarchy.

This limits the ability of RML to map nested data.

### Mixed data formats

Data in one format can contain multiple or composite values stored in another format, 
e.g. a CSV dataset could contain columns containing JSON values.

To define the expected form of references to input data [RML-Core](https://kg-construct.github.io/rml-core/spec/docs/) employs the notion of a [reference formulation](https://kg-construct.github.io/rml-io/spec/docs/#reference-formulations) 
that is a property of every [logical source](https://kg-construct.github.io/rml-io/spec/docs/#defining-logical-sources).
However, currently a logical source is limited to having a single reference formulation, 
meaning mixed format data can only be referenced using a query language that supports just one of the formats.

### Joining of data sources

[RML-Core](https://kg-construct.github.io/rml-core/spec/docs/) restricts join operations to [referencing object maps](https://kg-construct.github.io/rml-core/spec/docs/#referencing-object-map). 
Since a referencing object map can only generate an object that is an IRI or blank node subject 
as specified by a [parent triples map](), 
it is not possible to combine data from two sources in one term, use data from a join on another position than the object, 
or generate a literal using data from a join.
Moreover, [RML-Core](https://kg-construct.github.io/rml-core/spec/docs/) cannot join correctly across hierarchies.
