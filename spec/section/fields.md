## Fields {#fields}

A <dfn>field</dfn> gives a name to data derived from the <a data-cite="RML-Core#dfn-abstract-logical-source">abstract logical source</a> on which the [=logical view=] is defined. 

A [=field=] (`rml:Field`) is represented by a resource that MUST contain:
- exactly one field name property (`rml:fieldName`), that specifies the [=name=] of the field
- zero or more field properties (`rml:field`), to describe nested [=field=], also of the type `rml:Field`

| Property                     | Domain                           | Range            |
|------------------------------|----------------------------------|------------------|
| `rml:fieldName`              | `rml:Field`                      | `xsd:string`     |
| `rml:field`                  | `rml:LogicalView` or `rml:Field` | `rml:Field`      |


There are two types of fields: an [=expression field=] and an [=iterable field=].

An <dfn>expression field</dfn> (`rml:ExpressionField`) is a type of <a data-cite="RML-Core#dfn-expression-map">expression map</a>.
Consequently, an [=expression field=] MUST have an <a data-cite="RML-Core#dfn-expressions">expression</a>. 

An <dfn>iterable field</dfn> (`rml:IterableField`) is a type of <a data-cite="RML-Core#dfn-iterable">iterable</a>. 
Consequently, an [=iterable field=] MUST have a <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> and a <a data-cite="RML-Core#dfn-iterator">logical iterator</a>.
If no reference formulation is declared for a field, the reference formulation of the field's [=parent=] is implied. 

### Field parents {#fieldparents}

A [=field=] MUST have a <dfn>parent</dfn> that is either <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a> or another [=field=]. The parent relation MUST not contain cycles: it is tree-shaped with a logical source as its root. The transitive parents of a [=field=], i.e., the [=field=]'s parent, the parent of the [=field=]'s parent, etcetera, are fittingly called the [=field=]'s <dfn>ancestors</dfn>. 

### Field names {#fieldnames}
A [=field=] MUST have a <dfn>declared name</dfn> that is an alphanumerical string. Fields with the same [=parent=] MUST have different declared names. If a [=field=]'s parent is another [=field=], we distinguish between the [=field=]'s declared name and the [=field=]'s name. A [=field=]'s <dfn data-lt="field name">name</dfn> is the concatenation of the name of the parent [=field=], a dot `.`, and the [=field=]'s declared name. 

<aside class=example id=ex-field>

In this example a [=field=] with [=declared name=] "name" is declared on the <a data-cite="RML-Core##dfn-logical-source">logical source</a> from [[[#ex-record-sequence]]] and added to the [=logical view=]. The parent of the field with [=declared name=] "name" is the <a data-cite="RML-Core##dfn-logical-source">logical source</a> `:jsonSource`.

<aside class=ex-mapping>

```turtle
:jsonView a rml:LogicalView ;
  rml:viewOn :jsonSource ;
  rml:field [
    a rml:ExpressionField ;
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

A [=field=] defines a [=record sequence=], called the <dfn>field record sequence</dfn>, that is obtained by consecutively applying the [=field=]'s <a data-cite="RML-Core#dfn-expressions">expression</a> (in case of an [=expression field=]) or the [=field=]'s <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> and a <a data-cite="RML-Core#dfn-iterator">logical iterator</a> (in case of an [=iterable field=]) on the [=parent records=], the <dfn>parent records</dfn> being the records in the record sequence defined by the field's [=parent=]. For a given [=field=], the [=field record sequence=] has these keys and corresponding values:

- An index key `{fieldName}.#` with as values the position of the current entry in the [=field record sequence=].
- A key `{fieldName}` with as values the records in the [=field record sequence=].

<aside class=example id=ex-field-record-sequence>

In this example a [=field=] with [=declared name=] "item" is added to the [=logical view=] from [[[#ex-field]]]. Additionally a nested [=field=] "type" and a nested [=field=] "weight" are added to the "item" [=field=], .

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
    rml:iterator "$.items[*]" ;
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

### Field reference formulations {#fieldreferenceformulations}

For the application of the expression of an [=expression field=] (`rml:ExpressionField`) on the records of the field's [=parent=], the parent's <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> is used. 
Consequently, the parent of an [=expression field=] MUST be an <a data-cite="RML-Core##dfn-iterable">iterable</a>, i.e. an <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a> or [=iterable field=].  

The default <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> of an [=iterable field=] (`rml:IterableField`) is the <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> of the field's [=parent=]. 
If the [=iterable field=]'s [=parent=] is an [=expression field=], the [=iterable field=] MUST declare an own <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a>.
Declaring a new <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a>, i.e. a <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> that is different from the <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> of the field's [=parent=], is only allowed when the field's [=parent=] is an [=expression field=]. 

<aside class=example id=ex-mixed-format-json-csv>

In this example a [=logical view=] is defined on a <a data-cite="RML-Core#dfn-logical-source">logical source</a> with reference formulation `rml:JSONPath`.
The [=field=] with [=declared name=] "items" is evaluated using this reference formulation.
The nested [=field=] with [=declared name=] "item" has a declared <a data-cite="RML-Core#dfn-reference-formulation">reference formulation</a> `rml:CSV` and CSV row as implicit iterator. 
Its records are a sequence of logical iterations defined by its iterator. 
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
:mixedJSONSource a rml:LogicalSource ;
  rml:source :mixedJSONFile ;
  rml:referenceFormulation rml:JSONPath ;
  rml:iterator "$.people[*]" .

:mixedJSONView a rml:LogicalView ;
  rml:viewOn :mixedJSONSource ;
  rml:field [ 
    a rml:ExpressionField ;
    rml:fieldName "items" ;
    rml:reference "$.items" ;
    rml:field [ 
      a rml:IterableField ; 
      rml:referenceFormulation rml:CSV;
      rml:field [ 
        a rml:ExpressionField ; 
        rml:fieldName "type" ;
        rml:reference "type" ;
      ] ;
      rml:field [ 
        a rml:ExpressionField;
        rml:fieldName "weight" ;
        rml:reference "weight" ;
      ] ;
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
<td>items</td>
<td>items.#</td>
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
<td>type,weight\nsword,1500\nshield,2500</td>
<td>0</td>
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
<td>type,weight\nsword,1500\nshield,2500</td>
<td>0</td>
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
<td>type,weight\nflower,15</td>
<td>0</td>
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

A <dfn>field reference</dfn> is a <a data-cite="RML-Core#dfn-reference-expression">reference expression</a> that references a defined [=field=]. 
A [=field reference=] MUST be a defined [=field name=] of an [=expression field=], to obtain the records in the [=field record sequence=], or a defined [=field name=] followed by the string `.#` of a [=field=], to obtain the index key of the position of the current entry in the [=field record sequence=]. 
A [=field reference=] is a special type of <a data-cite="RML-Core#dfn-reference-expression">reference expression</a> for which no reference formulation need be defined.

A [=field reference=] can be used in <a data-cite="RML-Core#dfn-expression-map">expression maps</a> just as any other <a data-cite="RML-Core#dfn-reference-expression">reference expression</a>.

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
