## Fields {#fields}

A <dfn>field</dfn> is a type of <a data-cite="RML-Core#dfn-expression-map">expression map</a>, that gives a name to an <a data-cite="RML-Core#dfn-expressions">expression</a>. Consequently, a [=field=] MUST have an <a data-cite="RML-Core#dfn-expressions">expression</a>.

A [=field=] is also a type of <a data-cite="RML-Core#dfn-logical-iterable">logical iterable</a>. Consequently, a [=field=] MUST have exactly one <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> and exactly one <a data-cite="RML-Core#dfn-iterator">logical iterator</a>. 

A [=field=] (`rml:Field`) MUST have the following additional properties:
- exactly one field name property (`rml:fieldName`), that specifies the [=name=] of the field
- zero or more field properties (`rml:field`), to describe nested [=field=], also of the type `rml:Field`

| Property                     | Domain                           | Range            |
|------------------------------|----------------------------------|------------------|
| `rml:fieldName`              | `rml:Field`                      | `xsd:string` |
| `rml:field`                  | `rml:LogicalView` or `rml:Field` | `rml:Field`      |

### Field parents {#fieldparents}

A [=field=] MUST have a <dfn data-lt="field parent">parent</dfn> that is either a <!-- TODO reference to core, dependent on https://github.com/kg-construct/rml-core/issues/127-->[logical source]() or another [=field=]. The parent relation MUST not contain cycles: it is tree-shaped with a logical source as its root. The transitive parents of a [=field=], i.e., the [=field=]'s parent, the parent of the [=field=]'s parent, etcetera, are fittingly called the [=field=]'s <dfn>ancestors</dfn>. 

### Field names {#fieldnames}
A [=field=] MUST have a <dfn>declared name</dfn> that is an alphanumerical string. [=Fields=] with the same parent MUST have different declared names. If a [=field=]'s parent is another [=field=], we distinguish between the [=field=]'s declared name and the [=field=]'s name. A [=field=]'s <dfn data-lt="field name">name</dfn> is the concatenation of the name of the parent [=field=], a dot `.`, and the [=field=]'s declared name. 

<aside class=example id=ex-field>

In this example a [=field=] with [=declared name=] "name" is declared on the <a data-cite="RML-Core##dfn-logical-source">logical source</a> from [[[#ex-record-sequence]]] and added to the [=logical view=]. The parent of the field with [=declared name=] "name" is the <a data-cite="RML-Core##dfn-logical-source">logical source</a> `:jsonSource`.

<aside class=ex-mapping>

```turtle
:jsonView a rml:LogicalView ;
  rml:viewOn :jsonSource ;
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

<aside class="note">
Note that the tabular representation of the [=field record sequence=] in [[[#ex-field]]] is just one possible way of representing fields.
</aside>

### Field record sequences and records {#fieldrecords}

A [=field=] defines a [=record sequence=], called the <dfn>field record sequence</dfn>, that is obtained by consecutively applying the [=field=]'s <a data-cite="RML-Core#dfn-expressions">expression</a> on the [=parent records=], the <dfn>parent records</dfn> being the records in the record sequence defined by the [=field parent=]. For a given [=field=], the [=field record sequence=] has these keys and corresponding values:

- A key that with the same name as the parent's index key that has as value the position of the [=parent record=] in the parent's [=record sequence=].
- An index key `{fieldName}.#` with as values the position of the current entry in the sequence defined by the [=parent record=] and the [=field=]'s <a data-cite="RML-Core#dfn-expressions">expression</a>.
- A key `{fieldName}` with as values the records in the sequence defined by the [=parent record=] and the [=field=]'s <a data-cite="RML-Core#dfn-expressions">expression</a>.

<aside class=example id=ex-field-record-sequence>

In this example a [=field=] with [=declared name=] "item" is added to the [=logical view=] from [[[#ex-field]]]. Additionally a nested [=field=] "type" and a nested [=field=] "weight" are added to the "item" [=field=], .

<aside class=ex-mapping>

```turtle
:jsonView a rml:LogicalView ;
  rml:viewOn :jsonSource ;
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
<th>item.weight.#</th>
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
{...}
```

</td>
<td>0</td>
<td>sword</td>
<td>0</td>
<td>1500</td> -->
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
<td>2500</td> -->
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
<td>15</td> -->
</tr>
</table>

</aside>

</aside>

### Field reference formulations and iterators {#fieldreferenceformulations}

A [=field=] MUST have a <a data-cite="RML-Core#dfn-reference-formulation">reference formulation</a> and a <a data-cite="RML-Core#dfn-iterator">logical iterator</a> . 
If no reference formulation is declared for a field, the reference formulation of the [=field parent=] is implied.
If no iterator is declared for a field, the default iterator of the field's reference formulation is implied.

For the application of the <a data-cite="RML-Core#dfn-expressions">expression</a> of a [=field=] on the records of the [=field parent=], the parent's reference formulation is used, resulting in [=record sequence=] *R*. Afterwards the field's iterator is applied on this resulting record sequence *R* to obtain the [=field record sequence=] defined by the field. 

<aside class=example id=ex-mixed-format-json-csv>

In this example a [=logical view=] is defined on a <a data-cite="RML-Core#dfn-logical-source">logical source</a> with reference formulation `rml:JSONPath`.
The [=field=] with [=declared name=] "item" has a declared <a data-cite="RML-Core#dfn-reference-formulation">reference formulation</a> `rml:CSV` and CSV row as implicit iterator. 
First the expression "$.items" is evaluated using the reference formulation of the [=field parent=]. Second, the implicit iterator of the field is applied on the resulting records.
The nested fields with [=declared name=] "type" and "weight" are evaluated using the reference formulation `rml:CSV` from their parent field  with [=declared name=] "item".

```json
{
  "people": [
    {
      "name": "alice",
      "items": "type,weight\nsword,1500\nshield,2500"
    },
    {
      "name": "bob",
      "items": "type,weight\nflower,15"
    }
  ]
}  
```
</aside>
<aside class=ex-mapping>

```turtle
:mixedJSONSource a rml:InputLogicalSource ;
  rml:source :mixedJSONFile ;
  rml:referenceFormulation rml:JSONPath ;
  rml:iterator "$.people[*]" .

:mixedJSONView a rml:LogicalView ;
  rml:viewOn :mixedJSONSource ;
  rml:field [
    rml:fieldName "item" ;
    rml:reference "$.items" ;
    rml:referenceFormulation rml:CSV;
    rml:field [
      rml:fieldName "type" ;
      rml:reference "type" ;
    ] ;
    rml:field [
      rml:fieldName "weight" ;
      rml:reference "weight" ;
    ] ;
  ] .
```

</aside>
Note some columns in the table below have been shortened for brevity.
<aside class="ex-intermediate">
<table>
<tr>
<td>#</td>
<td>&lt;it&gt;</td>
<td>item</td>
<td>item.#</td>
<td>item.type</td>
<td>item.type.#</td>
<td>item.weight</td>
<td>item.weight.#</td>
</tr>
<tr>
<td>0</td>
<td>

```json 

{...}
```

</td>
<td>sword,1500</td>
<td>0</td>
<td>sword</td>
<td>0</td>
<td>1500</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>

```json 

{...}
```

</td>
<td>shield,2500</td>
<td>1</td>
<td>shield</td>
<td>0</td>
<td>2500</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>

```json 

{...}
```


</td>
<td>flower,15</td>
<td>0</td>
<td>flower</td>
<td>0</td>
<td>15</td>
<td>0</td>
</tr>
</table>
</aside>

### Using field names in triples maps

A <dfn>field reference</dfn> is a <a data-cite="RML-Core#dfn-reference-expression">reference expression</a> that references a defined [=field=]. A [=field reference=] MUST be a defined [=field name=]. A [=field reference=] is a special type of <a data-cite="RML-Core#dfn-reference-expression">reference expression</a> for which no reference formulation need be defined.

A [=field reference=] can be used in <a data-cite="RML-Core#dfn-expression-map">expression maps</a> just as any other <a data-cite="RML-Core#dfn-reference-expression">reference expression</a>.

<aside class=example id=ex-field-in-triples-map>

<aside class=ex-mapping>

```turtle
:jsonView a rml:LogicalView ;
  rml:viewOn :jsonSource ;
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
    rml:template "http://example.org/person/{name}/item/{item.type}" ;
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
