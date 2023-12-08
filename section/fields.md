## RML Fields {#fields}

TODO blurb

### Iterators and references

An <dfn>iterator</dfn> defines an iteration loop over a <dfn>[logical source](https://rml.io/specs/rml/#logical-source)</dfn>: an iterator defines an ordered sequence of [=records=] from the logical source. An iterator MAY be a string in the language defined by the logical source's [=reference formulation=].

<aside class=note>
This definition of iterator is not (meaningfully) different from <a href=https://rml.io/specs/rml/#iterator>the definition</a> given in the RML specification.
</aside>

A <dfn>record</dfn> is an element of a [=logical source=]. Depending on the source type, records might take different forms: for tabular data sources, a record might be a row or a cell; for tree-structured sources like XML, a record might be a node; for document-structured sources like JSON, a record might be a document or attribute value. A [=record=] MUST have a string representation. It MAY be possible to refer to other records inside a record using a [=reference=].

<aside class=example id=csviterator>
The default iterator for CSV files is row-based iteration, skipping the header row. Therefore, in this example, the iterator of the logical source `:csvSource` defines two records: `alice,1995` and `bob,1999`.

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

</aside>

<aside class=example id=xpathiterator>
In this example, the XPath expression `/People/Person` is used as iterator. The sequence of records it defines are the `Person` nodes on the first level in the document that have string representations `&lt;Person name="cindy">&lt;Friends>&lt;Person name="dave"/>&lt;Person name="edmund"/>&lt;/Friends>&lt;/Person>` and `&lt;Person name="fred">&lt;Friends>&lt;/Friends>&lt;/Person>`.

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
  rml:referenceFormulation ql:XPath ;
  rml:iterator "/People/Person" .
```

</aside>

</aside>

<aside class=example id=jsonpathiterator>
In this example, the JSONPath expression `$.people[*]` is used as iterator. The sequence of records it defines are the elements of the `people` array in the document that have string representations `{ "name": "alice", "items": [{"type": "sword", "weight": 1500}, {"type": "shield", "weight": 2500}]}` and `{ "name": "bob", "items": [{"type": "flower", "weight": 15}]}`.

<aside class=ex-input>

```json
{ "people": [
    { "name": "alice", 
      "items": [
        {"type": "sword", "weight": 1500},
        {"type": "shield", "weight": 2500}
      ]
    },
    { "name": "bob", 
      "items": [
        {"type": "flower", "weight": 15}
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

</aside>

A <dfn>reference</dfn> is used to refer to [=records=] in a [=logical source=]. For a given record, a reference MUST either define an ordered sequence of records, called the <dfn>reference values</dfn>, or throw an error. A reference MUST be a valid identifier for the given <dfn>reference formulation</dfn>. A reference formulation MAY be a language with a [formal grammar](https://en.wikipedia.org/wiki/Formal_grammar) that accepts well-formed string literals.

<aside class=note>
This definition of reference <i>is</i> different from <a href=https://rml.io/specs/rml/#iterator>the definition</a> given in the RML specification on two points. Firstly, the RML specification speaks of a single reference value, while here an ordered sequence of reference values is considered. Secondly, we consider reference values that might again be records.
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

### Fields and record sequences

A <dfn>record sequence</dfn> is an ordered sequence of sets of key-value pairs, where each key is a string and each value a [=record=]. A record sequence MUST have a finite set of keys that appear in each set in the sequence. In any particular set in a record sequence, the value of a key MAY be a null value. 

An [=iterator=] defines a [=record sequence=] from the iterator's [=logical source=], called the <dfn>iterator record sequence</dfn>. This record sequence has two keys:

- An index key `#` with as corresponding values the position of the current entry in the sequence defined by the iterator.
- A key `<it>` with as corresponding values the records in the sequence defined by the iterator.

TODO examples

A <dfn>field</dfn> gives a name to a [=reference=]. A field MUST have a <dfn data-lt="field-parent">parent</dfn> that is either a [=logical source=] or another field. The parent relation MUST not contain cycles: it is tree-shaped with a logical source as root. The transitive parents of a field, i.e., the field's parent, the parent of the field's parent, etcetera, are fittingly called the field's <dfn>ancestors</dfn>. A field MUST have a <dfn>declared name</dfn> that is an alphanumerical string. Fields with the same parent MUST have different declared names. If a field's parent is another field, we distinguish between the field's declared name and the field's name. A field's <dfn>name</dfn> is the concatentation of the name of the parent field, a dot `.`, and the field's declared name. A field MUST have a reference and a [=reference formulation=]. If no reference formulation is explicitly declared, the field has the same reference formulation as its parent (note that a logical source MUST have a reference formulation, so this is well-defined).

TODO examples

A [=field=] defines a [=record sequence=], called the <dfn>field record sequence</dfn>, that is obtained by consecutively applying the field's [=reference=] on the parent records, the <dfn>parent records</dfn> being the records in the record sequence defined by the field's [=parent=]. For a given field, the field record sequence has these keys and corresponding values:

- A key that with the same name as the parent's index key that has as value the position of the [=parent record=] in the parent's record sequence.
- An index key `{fieldname}.#` with as values the position of the current entry in the sequence defined by the parent record and the field's reference.
- A key `{fieldname}` with as values the records in the sequence defined by the parent record and the field's reference.

TODO examples

### Using field names in triples maps 