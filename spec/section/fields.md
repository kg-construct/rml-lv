## Fields {#fields}

A <dfn>field</dfn> gives a name to data derived from the <a data-cite="RML-Core#dfn-abstract-logical-source">abstract logical source</a> on which the [=logical view=] is defined.

A [=field=] (`rml:Field`) is represented by a resource that MUST contain:
- exactly one field name property (`rml:fieldName`), that specifies the [=declared name=] of the field
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
If no reference formulation is declared for an [=iterable field=], the reference formulation of the field's [=parent=] is implied. 

### Field parents {#fieldparents}

A [=field=] MUST have a <dfn>parent</dfn> that is either the <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a> of the [=logical view=] or another [=field=]. The parent relation MUST not contain cycles: it is tree-shaped with a [=logical view=] as its root. The transitive parents of a [=field=], i.e., the [=field=]'s parent, the parent of the [=field=]'s parent, etcetera, are fittingly called the [=field=]'s <dfn>ancestors</dfn>. 

### Field names {#fieldnames}

A [=field=] MUST have a <dfn>declared name</dfn> that is an alphanumerical string. Fields with the same [=parent=] MUST have different declared names. 
We distinguish between the [=field=]'s [=declared name=] and the [=field=]'s [=absolute name=]. 
If a [=field=]'s parent is another [=field=], the [=field=]'s <dfn>absolute name</dfn> is the concatenation of the name of the parent [=field=], a dot `.`, and the [=field=]'s declared name. 
Otherwise, the [=field=]'s [=absolute name=] equals its [=declared name=].  

<aside class=example id=ex-fieldnames>

In this example a [=field=] with [=declared name=] "name" is declared and added to the [=logical view=]. The parent of the field with [=declared name=] "name" is the <a data-cite="RML-Core##dfn-logical-source">logical source</a> `:jsonSource`.

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
<aside class=ex-mapping>

```turtle
:jsonSource a rml:LogicalSource ;
  rml:source :jsonFile ;
  rml:referenceFormulation rml:JSONPath ;
  rml:iterator "$.people[*]" .
  
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
<tr>
<th><u>#</u></th>
<th>&lt;it></th>
<th><u>name.#</u></th>
<th><u>name</u></th>
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

### Field records {#fieldrecords}

A [=field=] defines [=records=]:

- [=iterable records=] obtained by consecutively applying the [=expression field=]'s <a data-cite="RML-Core#dfn-expressions">expression</a>, or
- [=expression records=] obtained by consecutively applying the [=iterable field=]'s <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> and <a data-cite="RML-Core#dfn-iterator">logical iterator</a> on the [=parent records=], the <dfn>parent records</dfn> being the [=records=] defined by the field's [=parent=].

A field adds following keys and corresponding values to the [=logical view iteration sequence=]:

- A [=record key=] `{absoluteFieldName}` with as values the [=records=] defined by the [=field=].
- An accompanying [=index key=] `{absoluteFieldName}.#` with as values the position of the current [=record=] in the sequence of [=records=] derived from its [=parent record=].

<aside class=example id=ex-field-record-sequence>

In this example a [=field=] with [=declared name=] "item" is added to the [=logical view=] from [[[#ex-fieldnames]]]. Additionally a nested [=field=] "type" and a nested [=field=] "weight" are added to the "item" [=field=].

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

<aside class=ex-intermediate>
<table>
    <tr>
        <th><u>#</u></th>
        <th>&lt;it></th>   
        <th><u>name.#</u></th>
        <th><u>name</u></th>
        <th><u>item.#</u></th>
        <th>item</th>
        <th><u>item.type.#</u></th>
        <th><u>item.type</u></th>
        <th><u>item.weight.#</u></th>
        <th><u>item.weight</u></th> 
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

</aside>

### Field reference formulations {#fieldreferenceformulations}

For the evaluation of the expression of an [=expression field=] (`rml:ExpressionField`) on the records of the field's [=parent=], the parent's <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> is used. 
Consequently, the parent of an [=expression field=] MUST be an <a data-cite="RML-Core##dfn-iterable">iterable</a>, i.e. an <a data-cite="RML-Core##dfn-abstract-logical-source">abstract logical source</a> or [=iterable field=].  

The default <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> of an [=iterable field=] (`rml:IterableField`) is the <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> of the field's [=parent=]. 
If the [=iterable field=]'s [=parent=] is an [=expression field=], a <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> MUST be declared for the [=iterable field=].
Declaring a new <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a>, i.e. a <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> that is different from the <a data-cite="RML-Core##dfn-reference-formulation">reference formulation</a> of the field's [=parent=], is only allowed when the field's [=parent=] is an [=expression field=]. 

<aside class=example id=ex-mixed-format-json-csv>

In this example a [=logical view=] is defined on a <a data-cite="RML-Core#dfn-logical-source">logical source</a> with reference formulation `rml:JSONPath`.
The [=field=] with [=declared name=] "items" is evaluated using this <a data-cite="RML-Core#dfn-reference-formulation">reference formulation</a>.
The nested [=field=] with [=declared name=] "item" has a declared <a data-cite="RML-Core#dfn-reference-formulation">reference formulation</a> `rml:CSV` and CSV row as implicit iterator. 
Its records are a sequence of logical iterations defined by its iterator. 
The nested fields with [=declared name=] "type" and "weight" are evaluated using the reference formulation `rml:CSV` from their parent field with [=declared name=] "item".

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
<th><u>#</u></th>
<th>&lt;it&gt;</th>
<th><u>items</u></th>
<th><u>items.#</u></th>
<th>item</th>
<th><u>item.#</u></th>
<th><u>item.type</u></th>
<th><u>item.type.#</u></th>
<th><u>item.weight</u></th>
<th><u>item.weight.#</u></th>
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


