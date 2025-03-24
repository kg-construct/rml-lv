## Structural Annotations {#annotations}

<dfn>Structural annotations</dfn> provide a mechanism to express relationships between logical views, as well as additional information about fields.

Each [=logical view=] MAY have zero or more [=structural annotation=] properties (`rml:structuralAnnotation`), connecting the logical view to a structural annotation object (i.e., of type `rml:StructuralAnnotation`).

| Property                | Domain                | Range               |
|-------------------------|-----------------------|---------------------|
| `rml:structuralAnnotation`     | `rml:LogicalView` | `rml:StructuralAnnotation` |

Following [=structural annotations=] MAY be defined:
- [=Unique annotation=] (`rml:UniqueAnnotation`)
- [=ForeignKey annotation=] (`rml:ForeignKeyAnnotation`)
- [=NotNull annotation=] (`rml:NotNullAnnotation`)
- [=IriSafe annotation=] (`rml:IriSafeAnnotation`)
- [=PrimaryKey annotation=] (`rml:PrimaryKeyAnnotation`)
- [=Inclusion annotation=] (`rml:InclusionAnnotation`)

All structural annotations of a logical view <i>lv</i> MUST have an <dfn>on fields</dfn> property (`rml:onFields`), linking the structural annotation to a list of field names occurring in <i>lv</i>. Intuitively, property [=on fields=] specifies the fields in <i>lv</i> that are involved by the structural annotation. The semantics of this involvement depends on the specific annotation.

| Property                | Domain                | Range               |
|-------------------------|-----------------------|---------------------|
| `rml:onFields`             | `rml:StructuralAnnotation` | `rdf:List` |

### Invariance Principle

Structural annotations provide additional information about the data that might be used by the RML processor to optimize the KG construction process. If this additional information is incorrect, then the RML processor might either fail or produce wrong results. When using structural annotations, users should make sure that the following invariance principle is satisfied:

<i>For any source instances, the RDF graph produced by the RML engine using an <a data-cite="RML-Core#dfn-rml-mapping">RML mapping</a> with annotations, and the same  <a data-cite="RML-Core#dfn-rml-mapping">RML mapping</a> where annotations have been removed, MUST be the same.</i>

We emphasize that RML engines might exploit structural annotations, as they could totally ignore them. It is responsibility of the user to make sure that the annotations provided are indeed correct (that is, the data complies with the annotations). Sanity checks MAY be provided by the RML engines themselves, but this is not mandatory. Note that providing wrong annotations to an engine that takes annotations into account, for instance for applying optimizations, could result in a violation of the invariance principle, with unpredictable results.

### IriSafe

An <dfn data-lt="IriSafe annotation">IriSafe structural annotation</dfn> (`rml:IriSafeAnnotation`) [=on fields=] _F_ indicates that the content of each field in _F_ is [IRI safe](https://www.w3.org/TR/r2rml/#dfn-iri-safe), that is, each field in _F_ does not contain any character that is not in the [`iunreserved` production](http://tools.ietf.org/html/rfc3987#section-2.2) in [RFC3987](http://tools.ietf.org/html/rfc3987).

### PrimaryKey

A <dfn data-lt="PrimaryKey annotation">PrimaryKey structural annotation</dfn>  (`rml:PrimaryKeyAnnotation`) [=on fields=]  _(f1, ..., fn)_  imposes two conditions:

- no duplicate record sequences are present over the list of fields _(f1, ..., fn)_;
- No `NULL` value is admitted in any of the field _f1, ..., fn_.

Each [=logical view=] MAY specify AT MOST ONE [=PrimaryKey annotation=].

<aside class=example id="primary-key">

 Consider the following CSV file containing birthdays of people:

<aside class="ex-input">

```csv
name,birthyear
alice,1995
bob,1999
tobias,2005
lukas, 1986
```
</aside>

Now, assume that we know:

- Attribute `name` in the CSV is "UNIQUE" and "NOT NULL";

Such a constraint naturally corresponds to the notion of `PRIMARY KEY` from the world of relational databases. This fact could be valuable information for the RML engine, especially in the virtual setting. However, note that constraints cannot be expressed on CSV files.

We can exploit the mechanism of structural annotations to inform the RML engine about the existence of this constraint. We here work-out an example.

First, we specify the logical source corresponding to the CSV file:

<aside class=ex-mapping>

```turtle
:csvSource a rml:LogicalSource ;
  rml:source :csvFile ;
  rml:referenceFormulation rml:CSV .
```
</aside>

We are now ready to specify our logical view and associated `rml:primaryKeyAnnotation`.

<aside class=ex-mapping>

```turtle
:csvSource a rml:LogicalView ;
  rml:viewOn :csvSource ;
  rml:field [
    a rml:ExpressionField ;
    rml:fieldName "name";
    rml:reference "name"
 ];
 rml:field [
    a rml:ExpressionField ;
    rml:fieldName "birthday";
    rml:reference "birthday"
 ];
 rml:structuralAnnotation [
    a rml:primaryKeyAnnotation;
    rml:onFields ("name")
 ].
```
</aside>
</aside>

### Unique

The <dfn data-lt="Unique annotation">Unique structural annotation</dfn> (`rml:UniqueAnnotation`) is analogous to the notion of <i>UNIQUE constraints</i> in databases. Specifically, a [=Unique annotation=] [=on fields=]  _(f1, ..., fn)_  imposes the following condition:

- no duplicate record sequences are present over the list of fields _(f1, ..., fn)_.

Note that every [=PrimaryKey annotation=] is, as a matter of fact, also a [=Unique annotation=].

### NotNull

The <dfn data-lt="NotNull annotation">NotNull structural annotation</dfn> (`rml:NotNullAnnotation`) is analogous to the notion of <i>NOT NULL constraints</i> in databases. Specifically, a [=NotNull annotation=] [=on fields=]  _F_  imposes that each field in _F_ does not contain NULL values.

<aside class="note">
Note that every [=PrimaryKey annotation=] is, as a matter of fact, also a [=NotNull annotation=].
</aside>

### ForeignKey

The <dfn data-lt="ForeignKey annotation">ForeignKey structural annotation</dfn> (`rml:ForeignKeyAnnotation`) is analogous to the notion of <i>foreign key constraint</i> in databases. Specifically, a [=ForeignKey annotation=] [=on fields=]  _(f1, ..., fn)_ , [=target view=] <i>lv</i>, and [=target fields=] _(tf1,...,tfn)_ imposes the following conditions:

- each NULL-free record sequence over the list of fields _(f1, ..., fn)_ occurs also as a record sequence in _(tf1,...,tfn)_;
- Target view <i>lv</i> defines a [=Unique annotation=] [=on fields=] _(tf1,...,tfn)_.

The <dfn>target view</dfn> is a [=logical view=] specified through the property `rml:targetView`, whereas the <dfn>target fields</dfn> are an RDF list of field names specified through the property `rml:targetFields`. These two properties are specified as follows:

| Property           | Domain                    | Range             |
|--------------------|---------------------------|-------------------|
| `rml:targetView`   | `rml:InclusionAnnotation` | `rml:LogicalView` |
| `rml:targetFields` | `rml:InclusionAnnotation` | `rdf:List`        |

Therefore, each ForeignKey annotation MUST specify (additionally to the inherited `rml:onFields` property):

- Exactly one `rml:targetView` property
- Exactly one `rml:targetFields` property.

<aside class=example id="foreign-key">

Consider the following JSON file containing information about warriors.

<aside class="ex-input">

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

Now, assume that we know:

- Attribute `name` in the CSV of [[[#primary-key]]] is "UNIQUE" and "NOT NULL";
- All warriors in our domain are contained in the JSON of [[[#foreign-key]]].

The first constraint naturally corresponds to the notion of `PRIMARY KEY` from the world of relational databases. This fact could be valuable information for the RML engine, especially in the virtual setting. However, note that constraints cannot be expressed on CSV files.

The second constraint naturally corresponds to a `FOREIGN KEY` constraint from the world of relational databases. However, as the involved values spread across different (and diverse) sources, it cannot be expressed as such. Also this one could provide valuable information for the RML engine.

We can exploit the mechanism of structural annotations to inform the RML engine about the existence of such "relational-like" constraint. We here work out an example.

First, we need to specify the logical sources. The logical source corresponding to the CSV of [[[#primary-key]]]:

<aside class=ex-mapping>

```turtle
:csvSource a rml:LogicalSource ;
  rml:source :csvFile ;
  rml:referenceFormulation rml:CSV .
```
</aside>

The logical source corresponding to the JSON of [[[#foreign-key]]]:

<aside class=ex-mapping>

```turtle
:jsonSource a rml:LogicalSource ;
  rml:source :jsonFile ;
  rml:referenceFormulation rml:JSONPath ;
  rml:iterator "$.people[*]" .
```
</aside>

We are now ready to specify our logical views, and associated structural annotations. The first logical view is the one corresponding to `:csvSource`.

<aside class=ex-mapping>

```turtle
:csvSource a rml:LogicalView ;
  rml:viewOn :csvSource ;
  rml:field [
    a rml:ExpressionField ;
    rml:fieldName "name";
    rml:reference "name"
 ];
 rml:field [
    a rml:ExpressionField ;
    rml:fieldName "birthday";
    rml:reference "birthday"
 ];
 rml:structuralAnnotation [
    a rml:PrimaryKeyAnnotation;
    rml:onFields ("name");
 ].
```
</aside>

Now, we declare the logical view corresponding to `:jsonSource`. Note that this view contains a `rml:ForeignKeyAnnotation`:

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
    ]
  ] ;
  rml:structuralAnnotation [
    a rml:ForeignKeyAnnotation;
    rml:onFields ("name");
    rml:targetView :csvView;
    rml:targetFields ("name")
  ].
```
</aside>
</aside>

### Inclusion

The <dfn data-lt="Inclusion annotation">Inclusion structural annotation</dfn> (`rml:InclusionAnnotation`) is analogous to the notion of <i>inclusion dependency</i> in databases. Specifically, an [=Inclusion annotation=] [=on fields=]  _(f1, ..., fn)_ , [=target view=] <i>lv</i>, and [=target fields=] _(tf1,...,tfn)_ imposes the following condition:

- each NULL-free record sequence over the list of fields _(f1, ..., fn)_ occurs also as a record sequence in _(tf1,...,tfn)_;

As for [=ForeignKey annotation=], the [=target view=] MUST be a [=logical view=] specified through the property `rml:targetView`, whereas the <def>target fields</def> MUST be an RDF list of field names specified through the property `rml:targetFields`.

Therefore, each inclusion annotation MUST specify (additionally to the inherited `rml:onFields` property):

- Exactly one `rml:targetView` property
- Exactly one `rml:targetFields` property.

<aside class="note">
Note that every [=ForeignKey annotation=] is also an [=Inclusion annotation=].
</aside>
