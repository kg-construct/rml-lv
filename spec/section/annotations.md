## Structural Annotations {#annotations}

A [=field=] (`rml:field`) contains zero or more [=structural annotations=].
<dfn>Structural annotations</dfn> give additional information about the [=field=] (`rml:field`) and its relation to the structure of its [=logical view=] (`rml:LogicalView`).

Following [=structural annotations=] MAY be defined:
- unique
- foreignKey
- nonNullable
- otherFunctionalDependency
- iriSafe
- (datatype also?)
- primary key (i.e., UNIQUE and NOT NULL)

### Primary and Foreign Key

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
