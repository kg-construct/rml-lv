## RML Fields {#fields}

TODO blurb

### Records

A <dfn>record</dfn> is created using an [iterator](http://w3id.org/rml/core/spec#dfn-iterator) or an [expression](http://w3id.org/rml/core/spec#dfn-expressions). Depending on the source type, [=records=] might take different forms: for tabular data sources, a [=record=] might be a row or a cell; for tree-structured sources like XML, a [=record=] might be a node; for document-structured sources like JSON, a [=record=] might be a document or attribute value.

A [=record=] MUST have a string representation. It MAY be possible to derive other [=records=] from a [=record=] using an [expression](http://w3id.org/rml/core/spec#dfn-expressions).

<aside class=example id=csviterator>

<aside class="ex-input">

```csv
name,birthyear
alice,1995
bob,1999
```

</aside>

<aside class=ex-mapping>

```turtle
:csvSource a rml:logicalSource ;
  rml:source :csvFile ;
  rml:referenceFormulation rml:CSV .
```
</aside>

The default iterator for CSV files is row-based iteration, skipping the header row. Therefore, in this example, the iterator of the logical source `:csvSource` defines two [=records=]:

```csv
alice,1995
```

and

```csv
bob,1999
```
.

</aside>

<aside class=example id=xpathiterator>

<aside class="ex-input">

```xml
<People>
  <Person name="cindy">
    <Friends>
      <Person name="dave" />
      <Person name="edmund" />
    </Friends>
  </Person>
  <Person name="fred">
    <Friends>
    </Friends>
  </Person>
</People>
```

</aside>

<aside class=ex-mapping>

```turtle
:xmlSource a rml:logicalSource ;
  rml:source :xmlFile ;
  rml:referenceFormulation rml:XPath ;
  rml:iterator "/People/Person" .
```

</aside>

In this example, the XPath expression `/People/Person` is used as [iterator](http://w3id.org/rml/core/spec#dfn-iterator). The sequence of records it defines are the `Person` nodes on the first level in the document that have string representations

```xml
<Person name="cindy">
  <Friends>
    <Person name="dave"/>
    <Person name="edmund"/>
  </Friends>
</Person>
```

and

```xml
<Person name="fred">
  <Friends>
  </Friends>
</Person>
```
.


</aside>

<aside class=example id=jsonpathiterator>

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
:jsonSource a rml:logicalSource ;
  rml:source :jsonFile ;
  rml:referenceFormulation rml:JSONPath ;
  rml:iterator "$.people[*]" .
```

</aside>

In this example, the JSONPath expression `$.people[*]` is used as [iterator](http://w3id.org/rml/core/spec#dfn-iterator). The sequence of [=records=] it defines are the elements of the `people` array in the document that have string representations

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
and
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
.

</aside>

For a given [=record=], the evaluation of an [expression](http://w3id.org/rml/core/spec#dfn-expressions) against it MUST either result in an ordered sequence of [=records=], called the <dfn>expression values</dfn>, or throw an error. An [expression](http://w3id.org/rml/core/spec#dfn-expressions) MUST be valid for the given [reference formulation](http://w3id.org/rml/core/spec#dfn-reference-formulation).

<aside class=note>

This definition of expression _is_ different from [the definition](http://w3id.org/rml/core/spec#dfn-expressions) given in the RML Core specification on two points. Firstly, the RML Core specification defines the result of an expression evaluation as being a set of values, while here an ordered sequence of values is defined. Secondly, we consider expression values that might themselves be [=records=].

</aside>

<aside class=example id=csvreference>

Continuing [[[#csviterator]]], the reference `name` would define the length-one sequence `alice` from the record `alice,1995` and the length-one sequence `bob` from the record `bob,1999`.

The reference `nonsense` would give an error, since it is not in the header of the CSV file. Note the reference `nonsense` is not malformed. The reference `bad,ref` would *also* throw an error, as it is malformed: it contains the unescaped `,` separator.

</aside>

<aside class=example id=xpathreference>

Continuing [[[#xpathiterator]]], the reference `Friends/Person/@name` would define the length-two sequence `dave`, `edmund` from the record `&lt;Person name="cindy">&lt;Friends>&lt;Person name="dave"/>&lt;Person name="edmund"/>&lt;/Friends>&lt;/Person>` and the empty sequence from the record `&lt;Person name="fred">&lt;Friends>&lt;/Friends>&lt;/Person>`.

The reference `Siblings/Person/@name` would also define empty sequences of record. The reference `[unbalanced` would give an error, since it is not a valid relative XPath expression.

</aside>

<aside class=example id=jsonpathreference>

Continuing [[[#jsonpathiterator]]], the reference `$.items[*]` would define the length-two sequence `{"type": "sword", "weight": 1500}`, `{"type": "shield", "weight": 2500}` from the record `{ "name": "alice", "items": [{"type": "sword", "weight": 1500}, {"type": "shield", "weight": 2500}]}` and the length-one sequence `{"type": "flower", "weight": 15}` from the record `{ "name": "bob", "items": [{"type": "flower", "weight": 15}]}`.

The references `$.type` can be used to refer to data inside the records in the sequences defined by `$.items[*]`. Doing so would define the three length-one sequences `"sword"`, `"shield"` and `"flower"`.

The reference `$.nonsense` would define empty sequences of record since the `nonsense` attribute does not occur in the data. The reference `[unbalanced` would give an error, since it is not a valid relative JSONPath expression.

</aside>


### Extending the logical source

A [logical iteration](http://w3id.org/rml/core/spec#dfn-logical-iteration) MUST have a string representation.

<aside class="issue">
Describe how logical iteration relates to records.
</aside>

### Fields and record sequences

A <dfn>record sequence</dfn> is an ordered sequence of sets of key-value pairs, where each key is a string and each value a [=record=]. A record sequence MUST have a finite set of keys that appear in each set in the sequence. In any particular set in a record sequence, the value of a key MAY be a null value.

An [=iterator=] defines a [=record sequence=] from the iterator's [=logical source=], called the <dfn>iterator record sequence</dfn>. This record sequence has two keys:

- An index key `#` with as corresponding values the position of the current entry in the sequence defined by the iterator.
- A key `<it>` with as corresponding values the records in the sequence defined by the iterator.

<aside class=example id=ex-record-sequence>

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
:jsonSource a rml:logicalSource ;
  rml:source :jsonFile ;
  rml:referenceFormulation rml:JSONPath ;
  rml:iterator "$.people[*]" .
```

</aside>

<aside class="ex-intermediate">
<table>
<th>

`#`

</th>
<th>

`<it>`

</th>
<tr>
<td>
0
</td>
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
</tr>
<tr>
<td>
1
</td>
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
</tr>
</table>
</aside>

</aside>

A <dfn>field</dfn> is an [ExpressionMap](http://w3id.org/rml/core/spec#dfn-expression-map) that gives a name to an [expression](http://w3id.org/rml/core/spec#dfn-expressions). A [=field=] MUST have a <dfn data-lt="field-parent">parent</dfn> that is either a [=logical source=] or another [=field=]. The parent relation MUST not contain cycles: it is tree-shaped with a logical source as its root. The transitive parents of a [=field=], i.e., the [=field=]'s parent, the parent of the [=field=]'s parent, etcetera, are fittingly called the [=field=]'s <dfn>ancestors</dfn>. A [=field=] MUST have a <dfn>declared name</dfn> that is an alphanumerical string. [=Fields=] with the same parent MUST have different declared names. If a [=field=]'s parent is another [=field=], we distinguish between the [=field=]'s declared name and the [=field=]'s name. A [=field=]'s <dfn data-lt="field name">name</dfn> is the concatentation of the name of the parent [=field=], a dot `.`, and the [=field=]'s declared name. A [=field=] MUST have an [expression](http://w3id.org/rml/core/spec#dfn-expressions) and a [=reference formulation=]. If no reference formulation is explicitly declared, the [=field=] has the same [=reference formulation=] as its parent.

<aside class=example id=ex-field>

In this example a [=field=] with [=declared name=] "name" is declared on the [=logical source=] from [[[#ex-record-sequence]]].

<aside class=ex-mapping>

```turtle
:jsonSource a rml:logicalSource ;
  rml:source :jsonFile ;
  rml:referenceFormulation rml:JSONPath ;
  rml:iterator "$.people[*]" .
  rml:field [
    rml:name "name" ;
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

In this example a [=field=] with [=declared name=] "item" is added to the [=logical source=] from [[[#ex-field]]]. Additionally a nested [=field=] "type" is added to the "item" [=field=].

<aside class=ex-mapping>

```turtle
:jsonSource a rml:logicalSource ;
  rml:source :jsonFile ;
  rml:referenceFormulation rml:JSONPath ;
  rml:iterator "$.people[*]" .
  rml:field [
    rml:name "name" ;
    rml:reference "$.name" ;
  ] ;
  rml:field [
    rml:name "item" ;
    rml:reference "$.items[*]" ;
    rml:field [
      rml:name "type" ;
      rml:reference "$.type" ;
    ] ;
    rml:field [
      rml:name "weight" ;
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
:jsonSource a rml:logicalSource ;
  rml:source :jsonFile ;
  rml:referenceFormulation rml:JSONPath ;
  rml:iterator "$.people[*]" .
  rml:field [
    rml:name "name" ;
    rml:reference "$.name" ;
  ] ;
  rml:field [
    rml:name "item" ;
    rml:reference "$.items[*]" ;
    rml:field [
      rml:name "type" ;
      rml:reference "$.type" ;
    ] ;
    rml:field [
      rml:name "weight" ;
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
  rml:logicalSource :jsonSource ;
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
  rml:logicalSource :jsonSource ;
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
