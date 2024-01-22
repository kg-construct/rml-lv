## Fields {#fields}

A <dfn>field</dfn> is an [ExpressionMap](http://w3id.org/rml/core/spec#dfn-expression-map) that gives a name to an [expression](http://w3id.org/rml/core/spec#dfn-expressions). A [=field=] MUST have a <dfn data-lt="field-parent">parent</dfn> that is either a [=logical source=] or another [=field=]. The parent relation MUST not contain cycles: it is tree-shaped with a logical source as its root. The transitive parents of a [=field=], i.e., the [=field=]'s parent, the parent of the [=field=]'s parent, etcetera, are fittingly called the [=field=]'s <dfn>ancestors</dfn>. A [=field=] MUST have a <dfn>declared name</dfn> that is an alphanumerical string. [=Fields=] with the same parent MUST have different declared names. If a [=field=]'s parent is another [=field=], we distinguish between the [=field=]'s declared name and the [=field=]'s name. A [=field=]'s <dfn data-lt="field name">name</dfn> is the concatentation of the name of the parent [=field=], a dot `.`, and the [=field=]'s declared name. A [=field=] MUST have an [expression](http://w3id.org/rml/core/spec#dfn-expressions) and a [=reference formulation=]. If no reference formulation is explicitly declared, the [=field=] has the same [=reference formulation=] as its parent.

<aside class=example id=ex-field>

In this example a [=field=] with [=declared name=] "name" is declared on the [=logical source=] from [[[#ex-record-sequence]]] and added to the [=logical view=].

<aside class=ex-mapping>

```turtle
:jsonView a rml:LogicalView ;
  rml:onLogicalSource :jsonSource ;
  rml:field [
    rml:fieldName "name" ;
    rml:reference "$.name" ;
  ] .
```

</aside>

<aside class="ex-intermediate">
<table>
<th>#</th>
<th>

`<it>`

</th>
<th>name.#</th>
<th>name</th>
<tr>
<td>0</td>
<td>

```json
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
}
```

</td>
<td>0</td>
<td>alice</td>
</tr>
<tr>
<td>1</td>
<td>

```json
{
  "name": "bob",
  "items": [
    {
      "type": "flower",
      "weight": 15
    }
  ]
}
```

</td>
<td>0</td>
<td>bob</td>
</tr>
</table>
</aside>

</aside>

A [=field=] defines a [=record sequence=], called the <dfn>field record sequence</dfn>, that is obtained by consecutively applying the [=field=]'s [expression](http://w3id.org/rml/core/spec#dfn-expressions) on the [=parent records=], the <dfn>parent records</dfn> being the records in the record sequence defined by the [=field=]'s [=parent=]. For a given [=field=], the [=field record sequence=] has these keys and corresponding values:

- A key that with the same name as the parent's index key that has as value the position of the [=parent record=] in the parent's [=record sequence=].
- An index key `{fieldName}.#` with as values the position of the current entry in the sequence defined by the [=parent record=] and the [=field=]'s [expression](http://w3id.org/rml/core/spec#dfn-expressions).
- A key `{fieldName}` with as values the records in the sequence defined by the [=parent record=] and the [=field=]'s [expression](http://w3id.org/rml/core/spec#dfn-expressions).

<aside class=example id=ex-field-record-sequence>

In this example a [=field=] with [=declared name=] "item" is added to the [=logical view=] from [[[#ex-field]]]. Additionally a nested [=field=] "type" and a nested [=field=] "weight" are added to the "item" [=field=], .

<aside class=ex-mapping>

```turtle
:jsonView a rml:LogicalView ;
  rml:onLogicalSource :jsonSource ;
  rml:field [
    rml:fieldName "name" ;
    rml:reference "$.name" ;
  ] ;
  rml:field [
    rml:fieldName "item" ;
    rml:reference "$.items[*]" ;
    rml:field [
      rml:fieldName "type" ;
      rml:reference "$.type" ;
    ] ;
    rml:field [
      rml:fieldName "weight" ;
      rml:reference "$.weight" ;
    ] ;
  ] .
```

</aside>

<aside class="ex-intermediate">
<table>
<th>#</th>
<th>

`<it>`

</th>
<th>name.#</th>
<th>name</th>
<th>item.#</th>
<th>item</th>
<th>item.type.#</th>
<th>item.type</th>
<!-- <th>item.weight#</th>
<th>item.weight</th> -->
<tr>
<td>0</td>
<td>

```json
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
}
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
<!-- <td>0</td>
<td>1500</td> -->
</tr>
<tr>
<td>0</td>
<td>

```json
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
}
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
<td>1</td>
<td>shield</td>
<!-- <td>0</td>
<td>2500</td> -->
</tr>
<tr>
<td>1</td>
<td>

```json
{
  "name": "bob",
  "items": [
    {
      "type": "flower",
      "weight": 15
    }
  ]
}
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
<!-- <td>0</td>
<td>15</td> -->
</tr>
</table>

</aside>

</aside>

<aside class="note">
Note that the tabular representation of the [=field record sequence=] in [[[#ex-field-record-sequence]]] is just one possible way of representing fields.
</aside>

### Using field names in triples maps

A <dfn>field reference</dfn> is a [reference expression](http://w3id.org/rml/core/spec#dfn-reference-expression) that references a defined [=field=]. A [=field reference=] MUST be a defined [=field name=]. A [=field reference=] is a special type of [reference expression](http://w3id.org/rml/core/spec#dfn-reference-expression) for which no reference formulation need be defined.

A [=field reference=] can be used in [expression maps](http://w3id.org/rml/core/spec#dfn-expression-map) just as any other [reference expression](http://w3id.org/rml/core/spec#dfn-reference-expression).

<aside class=example id=ex-field-in-triples-map>

<aside class=ex-mapping>

```turtle
:jsonView a rml:LogicalView ;
  rml:onLogicalSource :jsonSource ;
  rml:field [
    rml:fieldName "name" ;
    rml:reference "$.name" ;
  ] ;
  rml:field [
    rml:fieldName "item" ;
    rml:reference "$.items[*]" ;
    rml:field [
      rml:fieldName "type" ;
      rml:reference "$.type" ;
    ] ;
    rml:field [
      rml:fieldName "weight" ;
      rml:reference "$.weight" ;
    ] ;
  ] .
```

</aside>

Note some columns in the table below have been shortened for brevity.

<aside class="ex-intermediate">
<table>
<th>#</th>
<th>

`<it>`

</th>
<th>name.#</th>
<th>name</th>
<th>item.#</th>
<th>item</th>
<th>item.type.#</th>
<th>item.type</th>
<th>item.weight#</th>
<th>item.weight</th>
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
<td>1</td>
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
    rml:template ""http://example.org/person/{name}/item/{item.type}" ;
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
  :hasItem <http://example.org/person/alice/item/sword> ,
           <http://example.org/person/alice/item/shield> .

<http://example.org/person/bob> :hasName "bob" ;
  :hasItem <http://example.org/person/bob/item/flower> .

<http://example.org/person/alice/item/sword> :hasName "sword" ;
  :hasWeight 1500 .

<http://example.org/person/alice/item/shield> :hasName "shield" ;
  :hasWeight 2500 .

<http://example.org/person/bob/item/flower> :hasName "flower" ;
  :hasWeight 15 .
```

</aside>

</aside>
