## RMLLVTC0006g

**Title**: Outer Join

**Description**: Test an outer join with unmatched child and parent logical iterations

**Error expected?** No

**Input**
```
{
  "people": [
    {
      "name": "alice",
      "items": [
        "sword",
        "shield"
      ]
    },
    {
      "name": "bob",
      "items": [
        "flower"
      ]
    },
    {
      "name": "carol",
      "items": [
        "book"
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
    a rml:ExpressionField ;
    rml:fieldName "item" ;
    rml:reference "$.items[*]" ;
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
  rml:outerJoin [
    rml:parentLogicalView :jsonView ;
    rml:joinCondition [
      rml:parent "name" ;
      rml:child "name" ;
    ] ;
    rml:field [
      a rml:ExpressionField ;
      rml:fieldName "p_name" ;
      rml:reference "name" ;
    ] ;
    rml:field [
      a rml:ExpressionField ;
      rml:fieldName "json_item" ;
      rml:reference "item" ;
    ] ;
  ] .

:triplesMapChild a rml:TriplesMap ;
  rml:logicalSource :csvView ;
  rml:subjectMap [
    rml:template "http://example.org/person/{name}" ;
  ] ;
  rml:predicateObjectMap [
    rml:predicate :hasBirthYear ;
    rml:objectMap [
      rml:reference "birthyear" ;
      rml:datatype xsd:gYear ;
    ] ;
  ] .

:triplesMapParent a rml:TriplesMap ;
  rml:logicalSource :csvView ;
  rml:subjectMap [
    rml:template "http://example.org/person/{p_name}" ;
  ] ;
  rml:predicateObjectMap [
    rml:predicate :hasItem ;
    rml:objectMap [
      rml:template "http://example.org/person/{p_name}/item/{json_item}" ;
    ] ;
  ] .
```

**Output**
```
<http://example.org/person/alice> <http://example.org/hasBirthYear> "1995"^^<http://www.w3.org/2001/XMLSchema#gYear> .
<http://example.org/person/alice> <http://example.org/hasItem> <http://example.org/person/alice/item/sword> .
<http://example.org/person/alice> <http://example.org/hasItem> <http://example.org/person/alice/item/shield> .
<http://example.org/person/bob> <http://example.org/hasBirthYear> "1999"^^<http://www.w3.org/2001/XMLSchema#gYear> .
<http://example.org/person/bob> <http://example.org/hasItem> <http://example.org/person/bob/item/flower> .
<http://example.org/person/tobias> <http://example.org/hasBirthYear> "2005"^^<http://www.w3.org/2001/XMLSchema#gYear> .
<http://example.org/person/carol> <http://example.org/hasItem> <http://example.org/person/carol/item/book> .
```

