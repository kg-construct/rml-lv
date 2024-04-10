## Structural Annotations {#annotations}


<s>A [=field=] (`rml:field`) contains zero or more [=structural annotations=].</s>

<aside class="issue">
Davide Lanti:

I have a problem with definition above. While for certain annotations this might work (e.g., iriSafe and notNullable), for annotations possibly spanning across multiple fields (e.g., foreignKey and primaryKey) this won't suffice.

My proposals:

1) SQL way, having both variants: annotations for fields AND annotations for logical views;
2) only having annotations at the level of the logical view

In the remainder of this section, I try pursuing 1.
</aside>

<s>Structural annotations give additional information about fields [=field=] (`rml:field`) and their relations to the structure of their [=Logical View=] (`rml:LogicalView`).</s>

<aside class="issue">
Davide Lanti: The sentence above is a bit reductive. I have included it into the paragraph below.
</aside>

Logical views provide a way of organizing (and, sometimes, flattening) data from data sources into a relational format. Therefore, there is a natural correspondence between logical views and relational databases. This natural correspondence allows us exploit standard operations from the relational world, like [=inner join=] (`rml:innerJoin`) and [=left join=] (`rml:leftJoin`), when writing mappings.

One could think of inheriting not only operations, but also the ability to specify properties of fields (e.g., uniqueness) as well as relationships across logical views (e.g., inclusion dependencies). This ability would be useful in a number of scenarios, and particularly in the virtual one, where <i>integrity constraints</i> are essentially a requirement.

<dfn>Structural annotations</dfn> provide a mechanism to express relationships between logical views, as well as additional information about fields.

Each [=logical view=] MAY have zero or more [=structural annotation=] properties (`rml:structuralAnnotation`), connecting the logical view to a structural annotation object (i.e., of type `rml:StructuralAnnotation`).

| Property                | Domain                | Range               |
|-------------------------|-----------------------|---------------------|
| `rml:structuralAnnotation`     | `rml:LogicalView` | `rml:StructuralAnnotation` |

Following [=structural annotations=] MAY be defined:
- [=Unique=] (`rml:UniqueAnnotation`)
- [=ForeignKey=] (`rml:ForeignKeyAnnotation`)
- [=NotNull=] (`rml:NotNullAnnotation`)
- OtherFunctionalDependency
- [=IriSafe=] (`rml:IriSafeAnnotation`)
- (datatype also?)
- [=PrimaryKey=] (`rml:PrimaryKeyAnnotation`)
- [=Inclusion=]

Intuitively, semantics for the annotations above is the same as for relational databases.

All structural annotations of a logical view <i>lv</i> MUST have an <dfn>on fields</dfn> property (`rml:onFields`), linking the structural annotation to a list of field names occurring in <i>lv</i>. Intuitively, property [=on fields=] specifies the fields in <i>lv</i> that are involved by the structural annotation. The semantics of this involvement depends on the specific annotation.

| Property                | Domain                | Range               |
|-------------------------|-----------------------|---------------------|
| `rml:onFields`             | `rml:PrimaryKeyAnnotation` | `rdf:List` |

### Invariance Principle

Differently from integrity constraints in databases, structural annotations are intended to be <i>annotations</i>. That is, the following invariant principle should be satisfied:

<i>For any source instances, the RDF graph produced by the RML engine over an RML file with annotations, and the same file where annotations have been removed, MUST be the same.</i>

RML engines might exploit structural annotations, as they could totally ignore them. It is responsibility of the user to make sure that the annotations provided are indeed correct. Sanity checks MAY be provided by the RML engines themselves, but this is not mandatory. Note that providing wrong annotations to an engine that takes into account for annotations, for instance for applying optimizations, could result in a violation of the invariance principle, with unpredictable results.

### IriSafe

An <dfn>IriSafe</dfn> structural annotation (`rml:IriSafeAnnotation`) [=on fields=] _F_ indicates that the content of each field in _F_ is [IRI safe](https://www.w3.org/TR/r2rml/#dfn-iri-safe), that is, each field in _F_ does not contain any character that is not in the [`iunreserved` production](http://tools.ietf.org/html/rfc3987#section-2.2) in [RFC3987](http://tools.ietf.org/html/rfc3987).

### PrimaryKey

The <dfn>PrimaryKey</dfn> structural annotation (`rml:PrimaryKeyAnnotation`) is analogous to the notion of primary key for databases. Specifically, a [=PrimaryKey=] annotation [=on fields=]  _(f1, ..., fn)_  imposes two conditions:

- no duplicate record sequences are present over the list of fields _(f1, ..., fn)_;
- No `NULL` value is admitted in any of the field _f1, ..., fn_.

Each [=logical view=] MAY specify AT MOST ONE [=PrimaryKey=] annotation.

<aside class=example id=primary-key>

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

Such constraint naturally corresponds to the notion of `PRIMARY KEY` from the world of relational databases. This fact could be valuable information for the RML engine, especially in the virtual setting. However, note that constraints cannot be expressed on CSV files.

We can exploit the mechanism of structural annotations to inform the RML engine about the existence of such "relational-like" constraint. We here work-out an example.

First, we specify the logical source corresponding to the CSV:

<aside class=ex-mapping>

```turtle
:csvSource a rml:logicalSource ;
  rml:source :csvFile ;
  rml:referenceFormulation rml:CSV .
```
</aside>

We are now ready to specify our logical view and associated `rml:primaryKeyAnnotation`.

<aside class=ex-mapping>

```turtle
:csvSource a rml:LogicalView ;
  rml:onLogicalSource :csvSource ;
  rml:field [
    rml:fieldName "name";
    rml:reference "name"
 ];
 rml:field [
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

The <dfn>Unique</dfn> structural annotation (`rml:UniqueAnnotation`) is analogous to the notion of <i>UNIQUE constraints</i> in databases. Specifically, a [=Unique=] annotation [=on fields=]  _(f1, ..., fn)_  imposes the following condition:

- no duplicate record sequences are present over the list of fields _(f1, ..., fn)_.

Note that every [=PrimaryKey=] annotation is, as a matter of fact, also a [=Unique=] annotation.

### NotNull

The <dfn>NotNull</dfn> structural annotation (`rml:NotNullAnnotation`) is analogous to the notion of <i>NOT NULL constraints</i> in databases. Specifically, a [=NotNull=] annotation [=on fields=]  _F_  imposes that each field in _F_ does not contain NULL values.

Note that every [=PrimaryKey=] annotation is, as a matter of fact, also a [=NotNull=] annotation.

### ForeignKey

The <dfn>ForeignKey</dfn> structural annotation (`rml:ForeignKeyAnnotation`) is analogous to the notion of <i>foreign key constraint</i> in databases. Specifically, a [=ForeignKey=] annotation [=on fields=]  _(f1, ..., fn)_ , [=target view=] <i>lv</i>, and [=target fields=] _(tf1,...,tfn)_ imposes the following conditions:

- each NULL-free record sequence over the list of fields _(f1, ..., fn)_ occurs also as a record sequence in _(tf1,...,tfn)_;
- Target view <i>lv</i> defines a [=Unique=] annotation [=on fields=] _(tf1,...,tfn)_.

The <def>target view</def> is a [=logical view=] specified through the property `rml:targetView`, whereas the <def>target fields</def> are an RDF list of field names specified through the property `rml:targetFields`. These two properties are specified as follows:

| Property                | Domain                | Range               |
|-------------------------|-----------------------|---------------------|
| `rml:targetView`     | `rml:InclusionAnnotation`| `rml:LogicalView` |
| `rml:targetFields`     | `rml:InclusionAnnotation`| `rdf:List` |

<aside class=example id=foreign-key>

Consider the following XML file containing information about warriors.

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

- Attribute `name` in the CSV is "UNIQUE" and "NOT NULL";
- All warriors in our domain are contained in the CSV file.

The first constraint naturally corresponds to the notion of `PRIMARY KEY` from the world of relational databases. This fact could be valuable information for the RML engine, especially in the virtual setting. However, note that constraints cannot be expressed on CSV files.

The second constraint naturally corresponds to a `FOREIGN KEY` constraint from the world of relational databases. However, being the involved values spread across  different (and diverse) sources, it obviously cannot be expressed as such. Also this one could provide valuable information for the RML engine.

We can exploit the mechanism of structural annotations to inform the RML engine about the existence of such "relational-like" constraint. We here work-out an example.

First, we need to specify the logical sources. The logical source corresponding to the CSV:

<aside class=ex-mapping>

```turtle
:csvSource a rml:logicalSource ;
  rml:source :csvFile ;
  rml:referenceFormulation rml:CSV .
```
</aside>

The logical source corresponding to the JSON:

<aside class=ex-mapping>

```turtle
:jsonSource a rml:logicalSource ;
  rml:source :jsonFile ;
  rml:referenceFormulation rml:JSONPath ;
  rml:iterator "$.people[*]" .
```
</aside>

We are now ready to specify our logical views, and associated structural annotations. The first logical view is the one corresponding to `:csvSource`.

<aside class=ex-mapping>

```turtle
:csvSource a rml:LogicalView ;
  rml:onLogicalSource :csvSource ;
  rml:field [
    rml:fieldName "name";
    rml:reference "name"
 ];
 rml:field [
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


The <dfn>Inclusion</dfn> structural annotation (`rml:InclusionAnnotation`) is analogous to the notion of <i>inclusion dependency</i> in databases. Specifically, an [=Inclusion=] annotation [=on fields=]  _(f1, ..., fn)_ , [=target view=] <i>lv</i>, and [=target fields=] _(tf1,...,tfn)_ imposes the following condition:

- each NULL-free record sequence over the list of fields _(f1, ..., fn)_ occurs also as a record sequence in _(tf1,...,tfn)_;

Note that every [=ForeignKey annotation=] is also an [=Inclusion annotation=].
