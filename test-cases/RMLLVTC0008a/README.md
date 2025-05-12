## RMLLVTC0008a

**Title**: Cycle: Abstract Logical Source

**Description**: Test a cycle in the abstract logical source of a logical view

**Error expected?** Yes

**Mapping**
```
@prefix rml: <http://w3id.org/rml/> .
@prefix : <http://example.org/> .

:view1 a rml:LogicalView ;
  rml:viewOn :view2 ;
  rml:field [
    a rml:ExpressionField ;
    rml:fieldName "name1" ;
    rml:reference "name2" ;
  ] .

:view2 a rml:LogicalView ;
  rml:viewOn :view1 ;
  rml:field [
    a rml:ExpressionField ;
    rml:fieldName "name2" ;
    rml:reference "name1" ;
  ] .

:triplesMapPerson a rml:TriplesMap ;
  rml:logicalSource :view2 ;
  rml:subjectMap [
    rml:template "http://example.org/person/{name2}" ;
  ] ;
  rml:predicateObjectMap [
    rml:predicate :hasName ;
    rml:objectMap [
      rml:reference "name2" ;
    ] ;
  ] .

```

