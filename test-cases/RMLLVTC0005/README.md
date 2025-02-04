## RMLLVTC0005

**Title**: Index

**Description**: Test references to index keys, including joins

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
  rml:innerJoin [
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
  ] .

:triplesMapPerson a rml:TriplesMap ;
  rml:logicalSource :csvView ;
  rml:subjectMap [
    rml:template "http://example.org/people/{name}" ;
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
    rml:template "item_{#}_{item_type.#}" ;
    rml:termType rml:BlankNode ;
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
<http://example.org/people/alice> <http://example.org/hasName> "alice" .
<http://example.org/people/alice> <http://example.org/hasBirthyear> "1995"^^<http://www.w3.org/2001/XMLSchema#gYear> .
<http://example.org/people/alice> <http://example.org/hasItem> _:item_0_0 .
<http://example.org/people/alice> <http://example.org/hasItem> _:item_0_1 .
_:item_0_0 <http://example.org/hasType> "sword" .
_:item_0_0 <http://example.org/hasWeight> "1500"^^<http://www.w3.org/2001/XMLSchema#integer> .
_:item_0_1 <http://example.org/hasType> "shield" .
_:item_0_1 <http://example.org/hasWeight> "2500"^^<http://www.w3.org/2001/XMLSchema#integer> .
<http://example.org/people/bob> <http://example.org/hasName> "bob" .
<http://example.org/people/bob> <http://example.org/hasBirthyear> "1999"^^<http://www.w3.org/2001/XMLSchema#gYear> .
<http://example.org/people/bob> <http://example.org/hasItem> _:item_1_0 .
_:item_1_0 <http://example.org/hasType> "flower" .
_:item_1_0 <http://example.org/hasWeight> "15"^^<http://www.w3.org/2001/XMLSchema#integer> .

```

