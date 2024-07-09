## Records {#records}

A <dfn>record</dfn> is created using an <!-- TODO core or io, dependent on https://github.com/kg-construct/rml-lv/issues/7 and https://github.com/kg-construct/rml-lv/issues/14-->[iterator](http://w3id.org/rml/core/spec#dfn-iterator) or an <a data-cite="RML-Core#dfn-expressions">expression</a>. Depending on the source type, [=records=] might take different forms: for tabular data sources, a [=record=] might be a row or a cell; for tree-structured sources like XML, a [=record=] might be a node; for document-structured sources like JSON, a [=record=] might be a document or property value.

A [=record=] MUST have a string representation. It MAY be possible to derive other [=records=] from a [=record=] using an <a data-cite="RML-Core#dfn-expressions">expression</a>.

<aside class=example id=csviterator>

<aside class="ex-input">

```csv
name,birthyear
alice,1995
bob,1999
tobias,2005
```

</aside>

<aside class=ex-mapping>

```turtle
:csvSource a rml:InputLogicalSource ;
  rml:source :csvFile ;
  rml:referenceFormulation rml:CSV .
```
</aside>

The default iterator for CSV files is row-based iteration, skipping the header row. Therefore, in this example, the iterator of the logical source `:csvSource` defines three [=records=]:

```csv
alice,1995
```

and

```csv
bob,1999
```

and

```csv
tobias,2005
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
:xmlSource a rml:InputLogicalSource ;
  rml:source :xmlFile ;
  rml:referenceFormulation rml:XPath ;
  rml:iterator "/People/Person" .
```

</aside>

In this example, the XPath expression `/People/Person` is used as <!-- TODO core or io, dependent on https://github.com/kg-construct/rml-lv/issues/7 and https://github.com/kg-construct/rml-lv/issues/14-->[iterator](http://w3id.org/rml/core/spec#dfn-iterator). The sequence of [=records=] it defines are the `Person` nodes on the first level in the document that have string representations

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
:jsonSource a rml:InputLogicalSource ;
  rml:source :jsonFile ;
  rml:referenceFormulation rml:JSONPath ;
  rml:iterator "$.people[*]" .
```

</aside>

In this example, the JSONPath expression `$.people[*]` is used as <!-- TODO core or io, dependent on https://github.com/kg-construct/rml-lv/issues/7 and https://github.com/kg-construct/rml-lv/issues/14-->[iterator](http://w3id.org/rml/core/spec#dfn-iterator). The sequence of [=records=] it defines are the elements of the `people` array in the document that have string representations.

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

For a given [=record=], the evaluation of an <a data-cite="RML-Core#dfn-expressions">expression</a> against it MUST either result in an ordered sequence of [=records=], called the <dfn>expression values</dfn>, or throw an error. An <a data-cite="RML-Core#dfn-expressions">expression</a> MUST be valid for the given <!-- TODO core or io, dependent on https://github.com/kg-construct/rml-lv/issues/7 and https://github.com/kg-construct/rml-lv/issues/14-->[reference formulation](http://w3id.org/rml/core/spec#dfn-reference-formulation).

<aside class=note>

This definition of expression _is_ different from <a data-cite="RML-Core#dfn-expressions">the definition</a> given in the RML Core specification on two points. Firstly, the RML Core specification defines the result of an expression evaluation as being a set of values, while here an ordered sequence of values is defined. Secondly, we consider expression values that might themselves be [=records=].

</aside>

<aside class=example id=csvreference>

Continuing [[[#csviterator]]], the reference `name` would define the length-one sequence `alice` from the record `alice,1995`, the length-one sequence `bob` from the record `bob,1999` and the length-one sequence `tobias` from the record `tobias,2005`.

The reference `nonsense` would give an error, since it is not in the header of the CSV file. Note the reference `nonsense` is not malformed. The reference `bad,ref` would *also* throw an error, as it is malformed: it contains the unescaped `,` separator.

</aside>

<aside class=example id=xpathreference>

Continuing [[[#xpathiterator]]], the reference `Friends/Person/@name` would define the length-two sequence `dave`, `edmund` from the record `<Person name="cindy"><Friends><Person name="dave"/><Person name="edmund"/></Friends></Person>` and the empty sequence from the record `<Person name="fred"><Friends></Friends></Person>`.

The reference `Siblings/Person/@name` would also define empty sequences of record. The reference `[unbalanced` would give an error, since it is not a valid relative XPath expression.

</aside>

<aside class=example id=jsonpathreference>

Continuing [[[#jsonpathiterator]]], the reference `$.items[*]` would define the length-two sequence `{"type": "sword", "weight": 1500}`, `{"type": "shield", "weight": 2500}` from the record `{ "name": "alice", "items": [{"type": "sword", "weight": 1500}, {"type": "shield", "weight": 2500}]}` and the length-one sequence `{"type": "flower", "weight": 15}` from the record `{ "name": "bob", "items": [{"type": "flower", "weight": 15}]}`.

The references `$.type` can be used to refer to data inside the records in the sequences defined by `$.items[*]`. Doing so would define the three length-one sequences `"sword"`, `"shield"` and `"flower"`.

The reference `$.nonsense` would define empty sequences of record since the `nonsense` attribute does not occur in the data. The reference `[unbalanced` would give an error, since it is not a valid relative JSONPath expression.

</aside>


### Extending the logical source

A <a data-cite="RML-Core#dfn-logical-iteration">logical iteration</a> MUST have a string representation.

<aside class="issue">
Describe how logical iteration relates to records.
</aside>

### Record sequences

A <dfn>record sequence</dfn> is an ordered sequence of sets of key-value pairs, where each key is a string and each value a [=record=]. A record sequence MUST have a finite set of keys that appear in each set in the sequence. In any particular set in a record sequence, the value of a key MAY be a null value.

An <!-- TODO core or io, dependent on https://github.com/kg-construct/rml-lv/issues/7 and https://github.com/kg-construct/rml-lv/issues/14-->[iterator]() defines a [=record sequence=] from the iterator's <!-- TODO core or io, dependent on https://github.com/kg-construct/rml-lv/issues/7 and https://github.com/kg-construct/rml-lv/issues/14-->[logical source], called the <dfn>iterator record sequence</dfn>. This record sequence has two keys:

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
:jsonSource a rml:InputLogicalSource ;
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


