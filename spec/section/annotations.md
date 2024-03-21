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

Logical views provide a way of organizing (and, eventually, flatten) data from the sources in relational format. Therefore, there is a natural correspondence between logical views and relational databases. This natural correspondence allows us exploit, when writing mappings, standard operations from the relational world like [=inner join=] (`rml:innerJoin`) and [=left join=] (`rml:leftJoin`).

One could think of inheriting not only operations, but also the ability to specify properties of fields (e.g., uniqueness) as well as relationships across logical views (e.g., inclusion dependencies). This ability would be useful in a number of scenarios, and particularly in the virtual one, where <i>integrity constraints</i> are essentially a requirement.

<dfn>Structural annotations</dfn> provide a mechanism to express relationships between logical views (`rml:LogicalView`), as well as additional information about fields (`rml:field`) and their relations to the structure of their [=logical view=] (`rml:LogicalView`).

Following [=structural annotations=] MAY be defined:
- unique
- foreignKey
- nonNullable
- otherFunctionalDependency
- iriSafe
- (datatype also?)
- primaryKey (i.e., UNIQUE and NOT NULL)
- inclusionDependency

Intuitively, semantics for the annotations above is the same as for relational databases.

### Invariance Principle

Differently from integrity constraints in databases, structural annotations are intended to be <i>annotations</i>. That is, the following invariant principle should be satisfied:

<i>For any source instances, the RDF graph produced by the RML engine over an RML file with annotations, and the same file where annotations have been removed, MUST be the same.</i>

RML engines might exploit structural annotations, as they could totally ignore them. It is responsibility of the user to make sure that the annotations provided are indeed correct. Sanity checks MAY be provided by the RML engines themselves, but this is not mandatory. Note that providing wrong annotations could violate the invariance principle, with unpredictable results.

### iriSafe

The <dfn>IRI safe</dfn> (`rml:iriSafe`) structural annotation indicates that the content of a certain field is [IRI safe](), that is, that it does not contain any character that is not in the [`iunreserved` production](http://tools.ietf.org/html/rfc3987#section-2.2) in [[RFC3987](https://www.w3.org/TR/r2rml/#RFC3987)].

### Primary and Foreign Key

<aside class="issue">
Davide Lanti: I started to throw in a bit of content (examples). Missing formal definitions!
</aside>

Example of foreign key.

<aside class=example id=foreign-key>

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

We can exploit the mechanism of structural annotations to inform the RML engine about the existence of such "relational-like" constraints. We here work-out an example.

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
 ].
 rml:field [
    rml:fieldName "birthday";
    rml:reference "birthday"
 ].
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
    ] ;
  ] .
  rml:structuralAnnotation [
    a rml:ForeignKeyAnnotation;
    rml:onFields ("name");
    rml:targetView :csvView;
    rml:targetFields ("name")
  ].
```
</aside>

<aside class="issue">
To be elaborated
</aside>
