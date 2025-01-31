## RMLLVTC0009

**Title**: Two Left Joins

**Description**: Test two left joins

**Error expected?** No

**Input**
```
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

**Input 1**
```
name,birthyear
alice,1995
bob,1999
tobias,2005

```

**Input 2**
```
name,id
alice,123
bob,456
tobias,789

```

**Mapping**
```
@prefix rml: <http://w3id.org/rml/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix : <http://example.org/> .

:jsonSource a rml:LogicalSource ;
  rml:source [
    a rml:RelativePathSource , rml:Source ;
    rml:root rml:MappingDirectory ;
    rml:path "people.json" ;
  ] ;
  rml:referenceFormulation rml:JSONPath ;
  rml:iterator "$.people[*]" .

:jsonView a rml:LogicalView ;
  rml:viewOn :jsonSource ;
  rml:field [ a
    rml:ExpressionField ;
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

  :additionalCsvSource a rml:LogicalSource ;
    rml:source [
      a rml:RelativePathSource , rml:Source ;
      rml:root rml:MappingDirectory ;
      rml:path "people2.csv" ;
    ] ;
    rml:referenceFormulation rml:CSV .

  :additionalCsvView a rml:LogicalView ;
    rml:viewOn :additionalCsvSource ;
    rml:field [
      a rml:ExpressionField ;
      rml:fieldName "name" ;
      rml:reference "name" ;
    ] ;
    rml:field [
      a rml:ExpressionField ;
      rml:fieldName "id" ;
      rml:reference "id" ;
    ] ;
    .

:csvSource a rml:LogicalSource ;
  rml:source [
    a rml:RelativePathSource , rml:Source ;
    rml:root rml:MappingDirectory ;
    rml:path "people.csv" ;
  ] ;
  rml:referenceFormulation rml:CSV .

:csvView a rml:LogicalView ;
  rml:viewOn :csvSource ;
  rml:field [
    a rml:ExpressionField ;
    rml:fieldName "name" ;
    rml:reference "name" ;
  ] ;
  rml:field [
    a rml:ExpressionField ;
    rml:fieldName "birthyear" ;
    rml:reference "birthyear" ;
  ] ;
  rml:leftJoin [
    rml:parentLogicalView :jsonView ;
    rml:joinCondition [
      rml:parent "name" ;
      rml:child "name" ;
    ] ;
    rml:field [
      a rml:ExpressionField ;
      rml:fieldName "item_type" ;
      rml:reference "item.type" ;
    ] ;
    rml:field [
      a rml:ExpressionField ;
      rml:fieldName "item_weight" ;
      rml:reference "item.weight" ;
    ] ;
  ] ;
  rml:leftJoin [
    rml:parentLogicalView :additionalCsvView ;
    rml:joinCondition [
      rml:parent "name" ;
      rml:child "name" ;
    ] ;
    rml:field [
      a rml:ExpressionField ;
      rml:fieldName "id" ;
      rml:reference "id" ;
    ] ;
  ] .

:triplesMapPerson a rml:TriplesMap ;
  rml:logicalSource :csvView ;
  rml:subjectMap [
    rml:template "http://example.org/people/{id}" ;
  ] ;
  rml:predicateObjectMap [
    rml:predicate :hasName ;
    rml:objectMap [
      rml:reference "name" ;
    ] ;
  ] ;
  rml:predicateObjectMap [
    rml:predicate :hasBirthyear ;
    rml:objectMap [
      rml:reference "birthyear" ;
      rml:datatype xsd:gYear ;
    ] ;
  ] ;
  rml:predicateObjectMap [
    rml:predicate :hasItem ;
    rml:objectMap [
      rml:parentTriplesMap :triplesMapItem ;
    ] ;
  ] .

:triplesMapItem a rml:TriplesMap ;
  rml:logicalSource :csvView ;
  rml:subjectMap [
    rml:template "http://example.org/item_{#}_{item_type.#}" ;
  ] ;
  rml:predicateObjectMap [
    rml:predicate :hasType ;
    rml:objectMap [
      rml:reference "item_type" ;
    ] ;
  ] ;
  rml:predicateObjectMap [
    rml:predicate :hasWeight ;
    rml:objectMap [
      rml:reference "item_weight" ;
      rml:datatype xsd:integer ;
    ] ;
  ] .

```

**Output**
```
<http://example.org/people/123> <http://example.org/hasName> "alice" .
<http://example.org/people/123> <http://example.org/hasBirthyear> "1995"^^<http://www.w3.org/2001/XMLSchema#gYear> .
<http://example.org/people/123> <http://example.org/hasItem> <http://example.org/item_0_0> .
<http://example.org/people/123> <http://example.org/hasItem> <http://example.org/item_0_1> .
<http://example.org/item_0_0> <http://example.org/hasType> "sword" .
<http://example.org/item_0_0> <http://example.org/hasWeight> "1500"^^<http://www.w3.org/2001/XMLSchema#integer> .
<http://example.org/item_0_1> <http://example.org/hasType> "shield" .
<http://example.org/item_0_1> <http://example.org/hasWeight> "2500"^^<http://www.w3.org/2001/XMLSchema#integer> .
<http://example.org/people/456> <http://example.org/hasName> "bob" .
<http://example.org/people/456> <http://example.org/hasBirthyear> "1999"^^<http://www.w3.org/2001/XMLSchema#gYear> .
<http://example.org/people/456> <http://example.org/hasItem> <http://example.org/item_1_0> .
<http://example.org/item_1_0> <http://example.org/hasType> "flower" .
<http://example.org/item_1_0> <http://example.org/hasWeight> "15"^^<http://www.w3.org/2001/XMLSchema#integer> .
<http://example.org/people/789> <http://example.org/hasName> "tobias" .
<http://example.org/people/789> <http://example.org/hasBirthyear> "2005"^^<http://www.w3.org/2001/XMLSchema#gYear> .

```

