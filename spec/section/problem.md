## Problem {#problem}

*This section is non-normative.*

RML Logical Views aims to resolve challenges such as handling hierarchy of nested data, more flexible joining (also across data hierarchies), and handling data sources that mix source formats.

### Nested data structures

References to nested data structures, like JSON or XML, may return multiple values. These values can be composite: they may again contain multiple values. 
[[RML-Core]] defines mapping constructs that produce results by combining the results of other mapping constructs in a specific order. 
For example, a <a data-cite="RML-Core#dfn-triples-map">triples map</a> combines the results of a <a data-cite="RML-Core#dfn-subject-map">subject map</a> and a <a data-cite="RML-Core#dfn-predicate-object-map">predicate-object map</a> in that order. 
Another example is a <a data-cite="RML-Core#dfn-template-expression">template expression</a>, 
which combines character strings and zero or more <a data-cite="RML-Core#dfn-reference-expression">reference expressions</a> in declared order. 
When mapping constructs produce multiple results, the combining mapping constructs will apply an <a data-cite="RML-Core#dfn-n-ary-cartesian-product">n-ary Cartesian product</a> over the sets of results, maintaining the order of the mapping constructs. In the case of nested data structures, this may cause the generation of results that do not match the source hierarchy, i.e. do not follow the root-to-leaf paths in the source data, since values are combined irrespective of it.

Furthermore, there is varying expressiveness in data source expression and query languages, and many languages have limited support for hierarchy traversal. For example, JSONPath has no operator to refer to an ancestor in the document hierarchy [[RFC9535]].

This limits the ability of [RML-Core](https://kg-construct.github.io/rml-core/spec/docs/) to map nested data.

<aside class=example id=ex-nesting-problem>
It is not possible to declare the construction of below output triples from below data source with RML-Core. 
<aside class=ex-input>

```json
{
  "people": [
    {
      "name": "alice",
      "items": [
        {
          "type": "sword",
          "weight": 1500
        },
        {
          "type": "shield",
          "weight": 2500
        }
      ]
    },
    {
      "name": "bob",
      "items": [
        {
          "type": "flower",
          "weight": 15
        }
      ]
    }
  ]
}
```
</aside>

<aside class="ex-output">

```turtle
:person/alice/item/sword :hasName "sword" ;
  :hasWeight 1500 .
:person/alice/item/shield :hasName "shield" ;
  :hasWeight 2500 .
:person/bob/item/flower :hasName "flower" ;
  :hasWeight 15 .
```
</aside>
</aside>


### Mixed data formats

Data in one format can contain multiple or composite values stored in another format, e.g. a CSV dataset could contain columns containing JSON values. To define the expected form of references to input data [RML-Core](https://kg-construct.github.io/rml-core/spec/docs/) employs the notion of a <!-- TODO reference to core, dependent on https://github.com/kg-construct/rml-core/issues/127-->[reference formulation](https://kg-construct.github.io/rml-io/spec/docs/#reference-formulations) that is a property of every <!-- TODO reference to core, dependent on https://github.com/kg-construct/rml-core/issues/127-->[logical source](https://kg-construct.github.io/rml-io/spec/docs/#defining-logical-sources). However, currently a logical source is limited to having a single reference formulation, meaning mixed format data can only be referenced using a query language that supports just one of the formats.

<aside class=example id=ex-mixed-format-problem>
It is not possible to declare the construction of below output triples from below data source with RML-Core. 
<aside class=ex-input>

```csv
name,item  
alice,"{""type"":""sword"",""weight"": 2500}" 
alice,"{""type"":""shield"",""weight"": 1500}"  
bob,"{""type"":""flower"",""weight"": 15 }"  
```
</aside>

<aside class="ex-output">

```turtle
:person/alice :hasItem "sword" , "shield" .
:person/bob :hasItem "flower" . 
```
</aside>
</aside>

### Joining of data sources

[RML-Core](https://kg-construct.github.io/rml-core/spec/docs/) restricts join operations to <a data-cite="RML-Core#referencing-object-map">referencing object maps</a>. Since a referencing object map can only generate an object that is an IRI or blank node subject as specified by a parent triples map, it is not possible to combine data from two sources in one term, use data from a join on another position than the object, or generate a literal using data from a join.
Moreover, [RML-Core](https://kg-construct.github.io/rml-core/spec/docs/) cannot declare join operations correctly across hierarchies.

<aside class=example id=ex-mixed-format-problem>
It is not possible to declare the construction of below output triples from below two data sources with RML-Core. 
<aside class=ex-input>

```csv
name,id
alice,123
bob,456
tobias,789
```
</aside>

<aside class=ex-input>

```csv
name,item_type
alice,sword
alice,shield
bob,flower
```
</aside>

<aside class="ex-output">

```turtle
:person/123 :hasItem "sword", "shield" . 
:person/456 :hasItem "flower" .
```
</aside>
</aside>
