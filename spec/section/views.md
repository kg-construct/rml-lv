## Logical views {#logicalviews}

A <dfn>logical view</dfn> is a type of <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a> that is derived from another <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a> by defining [=fields=] with data from said <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a>.

A [=logical view=] (`rml:LogicalView`) is represented by a resource that MUST contain:
- exactly one view on property (`rml:viewOn`), whose value is a <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a> (`rml:AbstractLogicalSource`),
- at least one field property (`rml:field`), whose value is a [=field=] (`rml:Field`).
- zero or more join properties (`rml:leftJoin`, `rml:innerJoin`), whose value is a [=logical view join=] (`rml:LogicalViewJoin`).

A [=logical view=] (`rml:LogicalView`) has an implicit default <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> (`rml:referenceFormulation`) and <a data-cite="RML-Core##dfn-iterator">logical iterator</a>  (`rml:iterator`), which MUST not be overwritten.

| Property        | Domain                           | Range                       |
|-----------------|----------------------------------|-----------------------------|
| `rml:viewOn`    | `rml:LogicalView`                | `rml:AbstractLogicalSource` |
| `rml:field`     | `rml:LogicalView` or `rml:Field` | `rml:Field`                 |
| `rml:leftJoin`  | `rml:LogicalView`                | `rml:LogicalViewJoin`       |
| `rml:innerJoin` | `rml:LogicalView`                | `rml:LogicalViewJoin`       |


### Logical view iterator {#logicalviewiterator}

The <a data-cite="RML-Core##dfn-iterator">logical iterator</a> of a [=logical view=] produces a <dfn>logical view iteration sequence</dfn>, i.e. an ordered sequence of sets of key-value pairs.
Each set of key-value pairs represents a <a data-cite="RML-Core#dfn-iteration">logical iteration</a> of the [=logical view=], called a <dfn>logical view iteration</dfn>.

Each key in a [=logical view iteration sequence=] is a string and each value is a [=record=] or a non-negative integer.
A <dfn>record</dfn> is either an [=iterable record=] or an [=expression record=].

An <dfn>iterable record</dfn> is a <a data-cite="RML-Core#dfn-iteration">logical iteration</a>, i.e. an item on which expressions can be evaluated.

An <dfn>expression record</dfn> is one element of an <a data-cite="RML-Core#https://kg-construct.github.io/rml-core/spec/docs/#dfn-expression-evaluation-result">expression evaluation result</a>.

A <dfn>record key</dfn> has a [=record=] as value. 
Each [=record key=] is accompanied with an [=index key=].

An <dfn>index key</dfn> has a non-negative integer as value, indicating the zero-based position of the corresponding record.

- For [=iterable records=], the index value denotes the position in the sequence of the <a data-cite="RML-Core#dfn-iteration">logical iteration</a>. For example: the second CSV row will be denoted with index value `1`.
- For [=expression records=], the index value denotes the position of the element in the <a data-cite="RML-Core#https://kg-construct.github.io/rml-core/spec/docs/#dfn-expression-evaluation-result">expression evaluation result</a>. For example, JSON object `{"elements": ["a", "b", "c"]}` with JSONPath expression `$.elements[*]` will return `"a"`, `"b"`, and `"c"` as <a data-cite="RML-Core#https://kg-construct.github.io/rml-core/spec/docs/#dfn-expression-evaluation-result">expression evaluation result</a> elements. Element `"c"` will be denoted with index value `2`.

A [=logical view iteration sequence=] MUST have a finite set of keys that appear in each [=logical view iteration=].
In any particular [=logical view iteration=], the value of a key MAY be a null value.

Each [=logical view iteration=] has at least the following keys:
- A "root" [=record key=] `<it>` with as corresponding values the [=iterable records=] produced by the <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a> in the sequence defined by the <a data-cite="RML-Core#dfn-iterator">logical iterator</a> of the [=logical view=].
- An accompanying "root" [=index key=] `#`.

Additional keys-value pairs with custom [=record keys=] can be defined by the [=fields=] of the [=logical view=],
which is further detailed in [[[#fields]]].

### Logical view expressions {#logicalviewexpressions}

A <dfn>logical view reference</dfn> is a <a data-cite="RML-Core#dfn-reference-expression">reference expression</a> that references a defined [=referenceable key=] in a [=logical view iteration=].
A <dfn>referenceable key</dfn> is either

- a [=record key=] of an [=expression record=], or
- an [=index key=].

A [=record key=] of an [=iterable record=] (including the [=record key=] `<it>`) cannot be referenced.

The <a data-cite="RML-Core#dfn-expression-evaluation-result">expression evaluation result</a> of a [=logical view reference=] is the value corresponding to the referenced key. 

The <a data-cite="RML-Core##dfn-natural-rdf-datatype">natural RDF datatype</a> of an [=index key=]'s values is [xsd:integer](https://www.w3.org/TR/xmlschema11-2/#integer).
The <a data-cite="RML-Core##dfn-natural-rdf-datatype">natural RDF datatype</a> of an [=expression record=] is obtained by applying the <a data-cite="RML-Core##dfn-natural-mapping">natural mapping</a> of the <a data-cite="RML-Core#dfn-reference-formulation">reference formulation</a> used to retrieve the [=record=].

A [=logical view reference=] can be used in <a data-cite="RML-Core#dfn-expression-map">expression maps</a> just as any other <a data-cite="RML-Core#dfn-reference-expression">reference expression</a>.

When a non-existing or a non-referenceable key is referenced, RML processors should report an error. 

<aside class=example id=ex-field-in-triples-map>

<aside class=ex-mapping>

```turtle
:jsonView a rml:LogicalView ;
  rml:viewOn :jsonSource ;
  rml:field [
    a rml:ExpressionField ;
    rml:fieldName "name" ;
    rml:reference "$.name" ;
  ] ;
  rml:field [
    a rml:IterableField ;
    rml:fieldName "item" ;
    rml:reference "$.items[*]" ;
    rml:field [
      a rml:ExpressionField ;
      rml:fieldName "type" ;
      rml:reference "$.type" ;
    ] ;
    rml:field [
      a rml:ExpressionField ;
      rml:fieldName "weight" ;
      rml:reference "$.weight" ;
    ] ;
  ] .
```

</aside>

Note some columns in the table below have been shortened for brevity.

<aside class="ex-intermediate">
<table>
<th><u>#</u></th>
<th>

`<it>`

</th>
<th><u>name.#</u></th>
<th><u>name</u></th>
<th><u>item.#</u></th>
<th>item</th>
<th><u>item.type.#</u></th>
<th><u>item.type</u></th>
<th><u>item.weight.#</u></th>
<th><u>item.weight</u></th>
<tr>
<td>0</td>
<td>

```json
{...}
```

</td>
<td>0</td>
<td>alice</td>
<td>0</td>
<td>

```json
{
  "type": "sword",
  "weight": 1500
}
```

</td>
<td>0</td>
<td>sword</td>
<td>0</td>
<td>1500</td>
</tr>
<tr>
<td>0</td>
<td>

```json
{...}
```

</td>
<td>0</td>
<td>alice</td>
<td>1</td>
<td>

```json
{
  "type": "shield",
  "weight": 2500
}
```

</td>
<td>0</td>
<td>shield</td>
<td>0</td>
<td>2500</td>
</tr>
<tr>
<td>1</td>
<td>

```json
{...}
```

</td>
<td>0</td>
<td>bob</td>
<td>0</td>
<td>

```json
{
  "type": "flower",
  "weight": 15
}
```

</td>
<td>0</td>
<td>flower</td>
<td>0</td>
<td>15</td>
</tr>
</table>

</aside>

<aside class="note">
Note that this tabular representation of the [=logical view iteration sequence=] is just one possible way of representing a [=logical view iteration sequence=].
The underlined keys represent [=referenceable keys=].
</aside>

<aside class=ex-mapping>

```turtle
:triplesMapPerson a rml:TriplesMap ;
  rml:logicalSource :jsonView ;
  rml:subjectMap [
    rml:template "http://example.org/person/{name}" ;
  ] ;
  rml:predicateObjectMap [
    rml:predicate :hasName ;
    rml:objectMap [
      rml:reference "name" ;
    ] ;
  ] ;
  rml:predicateObjectMap [
    rml:predicate :hasItem ;
    rml:objectMap [
      rml:parentTriplesMap :triplesMapItem ;
    ] ;
  ] .

:triplesMapItem a rml:TriplesMap ;
  rml:logicalSource :jsonView ;
  rml:subjectMap [
    rml:template "http://example.org/person/{name}/item/{item.#}" ;
  ] ;
  rml:predicateObjectMap [
    rml:predicate :hasName ;
    rml:objectMap [
      rml:reference "item.type" ;
    ] ;
  ] ;
  rml:predicateObjectMap [
    rml:predicate :hasWeight ;
    rml:objectMap [
      rml:reference "item.weight" ;
    ] ;
  ] .
```

</aside>

<aside class="ex-output">

```turtle
<http://example.org/person/alice> :hasName "alice" ;
  :hasItem <http://example.org/person/alice/item/0> ,
           <http://example.org/person/alice/item/1> .

<http://example.org/person/bob> :hasName "bob" ;
  :hasItem <http://example.org/person/bob/item/0> .

<http://example.org/person/alice/item/0> :hasName "sword" ;
  :hasWeight 1500 .

<http://example.org/person/alice/item/1> :hasName "shield" ;
  :hasWeight 2500 .

<http://example.org/person/bob/item/0> :hasName "flower" ;
  :hasWeight 15 .
```

</aside>

</aside>

