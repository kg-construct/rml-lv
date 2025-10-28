## RMLLVTC0008a

**Title**: Cycle: Fields

**Description**: Test a cycle in nested fields

**Error expected?** Yes

**Mapping**
```
@prefix rml: <http://w3id.org/rml/> .
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
  rml:field :field1 .

:field1 a rml:IterableField ;
  rml:fieldName "item" ;
  rml:referenceFormulation rml:JSONPath ;
  rml:iterator "$.items[*]" ;
  rml:field :field2.

:field2 a rml:ExpressionField ;
  rml:fieldName "type" ;
  rml:reference "$.type" ;
  rml:field :field1.

```

