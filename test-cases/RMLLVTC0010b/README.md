## RMLLVTC0010b

**Title**: Expression Map in Join Condition: Constant

**Description**: Test a constant-valued expression map in join condition 

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
      ],
      "race": "human"
    },
    {
      "name": "bob",
      "items": [
        "flower"
      ], 
      "race": "alien"
    }, 
    {
      "name": "tobias",
      "race": "human"
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
@prefix rml: <http://w3id.org/rml/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix : <http://example.org/>.

:jsonSource a rml:LogicalSource;
  rml:source [
    a rml:RelativePathSource, rml:Source;
    rml:root rml:MappingDirectory;
    rml:path "people.json";
  ];
  rml:referenceFormulation rml:JSONPath;
  rml:iterator "$.people[*]".

:jsonView a rml:LogicalView;
  rml:viewOn :jsonSource;
  rml:field [
    a rml:ExpressionField;
    rml:fieldName "jsonName";
    rml:reference "$.name";
  ];
  rml:field [
    a rml:ExpressionField;
    rml:fieldName "jsonRace";
    rml:reference "$.race";
  ];
  rml:field [
    a rml:ExpressionField;
    rml:fieldName "jsonItem";
    rml:reference "$.items[*]";
  ].

:csvSource a rml:LogicalSource;
  rml:source [
    a rml:RelativePathSource, rml:Source;
    rml:root rml:MappingDirectory;
    rml:path "people.csv";
  ];
  rml:referenceFormulation rml:CSV.

:csvView a rml:LogicalView;
  rml:viewOn :csvSource;
  rml:field [
    a rml:ExpressionField;
    rml:fieldName "csvName";
    rml:reference "name";
  ];
  rml:field [
    a rml:ExpressionField;
    rml:fieldName "csvBirthyear";
    rml:reference "birthyear";
  ];
  rml:innerJoin [
    rml:parentLogicalView :jsonView;
    rml:joinCondition [
      rml:parentMap [ rml:reference "jsonRace" ];
      rml:childMap [ rml:constant "human" ];
    ];
    rml:joinCondition [
      rml:parentMap [ rml:reference "jsonName" ];
      rml:childMap [ rml:reference "csvName" ];
    ];
    rml:field [
      a rml:ExpressionField;
      rml:fieldName "jsonItem";
      rml:reference "jsonItem";
    ];
  ].

:triplesMapPerson a rml:TriplesMap;
  rml:logicalSource :csvView;
  rml:subjectMap [ rml:template "http://example.org/person/{csvName}" ];
  rml:predicateObjectMap [
    rml:predicate :hasBirthYear;
    rml:objectMap [
      rml:reference "csvBirthyear";
      rml:datatype xsd:gYear;
    ];
  ];
  rml:predicateObjectMap [
    rml:predicate :hasItem;
    rml:objectMap [ rml:template "http://example.org/person/{csvName}/item/{jsonItem}" ];
  ].


```

**Output**
```
<http://example.org/person/alice> <http://example.org/hasBirthYear> "1995"^^<http://www.w3.org/2001/XMLSchema#gYear> .
<http://example.org/person/alice> <http://example.org/hasItem> <http://example.org/person/alice/item/shield> .
<http://example.org/person/alice> <http://example.org/hasItem> <http://example.org/person/alice/item/sword> .
<http://example.org/person/tobias> <http://example.org/hasBirthYear> "2005"^^<http://www.w3.org/2001/XMLSchema#gYear> .

```

