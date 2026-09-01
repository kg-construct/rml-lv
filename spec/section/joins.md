## Logical view joins {#viewjoins}

A <dfn>logical view join</dfn> (`rml:LogicalViewJoin`) is an operation that extends the logical iteration of one logical view (the [=child logical view=]) with fields derived from another logical view (the [=parent logical view=]),
using a <a data-cite="RML-Core#dfn-join">join condition</a>.

A [=logical view join=] MUST contain:
- exactly one parent logical view property (`rml:parentLogicalView`), whose value is a [=logical view=] (`rml:LogicalView`) that supplies the additional fields. This is referred to as the <dfn>parent logical view</dfn>.
- at least one join condition property (`rml:joinCondition`), whose value is a <a data-cite="RML-Core#dfn-join-condition">join condition</a>.
- at least one field property (`rml:field`), whose value is a <dfn>leaf expression field</dfn>, i.e., an [=expression field=] (`rml:ExpressionField`) without nested fields.
This field MUST contain only [=logical view references=] that can be evaluated on the parent logical view.
The [=declared name=] of this field MUST be different from the [=absolute name=] of every other field in the [=child logical view=].

Similar to how  <a data-cite="RML-Core#joins">joins are defined in RML-Core</a>,
the [=logical view=] in the subject position of the [=join property=] fulfills the role of <a data-cite="RML-Core#child-logical-source">child logical source</a> in the <a data-cite="RML-Core#dfn-join-condition">join condition(s)</a>, but of the [=logical view join=], and is referred to as <dfn>child logical view</dfn>.
The [=parent logical view=] fulfills the role of the <a data-cite="RML-Core#parent-logical-source">parent logical source</a> in the <a data-cite="RML-Core#dfn-join-condition">join condition(s)</a>, but of the [=logical view join=].

| Property                | Domain                | Range                 |
|-------------------------|-----------------------|-----------------------|
| `rml:parentLogicalView` | `rml:LogicalViewJoin` | `rml:LogicalView`     |
| `rml:joinCondition`     | `rml:LogicalViewJoin` | `rml:Join`            |
| `rml:field`             | `rml:LogicalViewJoin` | `rml:ExpressionField` |

### Join types {#dfn-join-type}

The <dfn>join property</dfn> specifies the join type of the [=logical view join=], i.e. a [=left join=], an [=outer join=], or an [=inner join=].

A logical iteration is <dfn>matched</dfn> when there is at least one logical iteration in the other logical view for which all <a data-cite="RML-Core#dfn-join-condition">join conditions</a> evaluate to `true`. For every matching pair, the fields from the [=logical view join=] are evaluated on the parent logical iteration and added to the child logical iteration, producing an extended logical iteration.

A logical iteration is <dfn>unmatched</dfn> when there is no logical iteration in the other logical view for which all <a data-cite="RML-Core#dfn-join-condition">join conditions</a> evaluate to `true`.

A <dfn>left join</dfn> (`rml:leftJoin`) is the equivalent of a left (outer) join in SQL, where the [=child logical view=] is the left part of the join, and the [=parent logical view=] is the right part of the join. For an unmatched child logical iteration, the fields from the [=logical view join=] in the extended logical iteration contain a null value.

An <dfn>outer join</dfn> (`rml:outerJoin`) is the equivalent of a full outer join in SQL, where the [=child logical view=] is the left part of the join, and the [=parent logical view=] is the right part of the join. All logical iterations from both logical views are retained. For an unmatched child logical iteration, the fields from the [=logical view join=] contain a null value. For an unmatched parent logical iteration, the fields from the [=child logical view=] contain a null value.

An <dfn>inner join</dfn> (`rml:innerJoin`) is the equivalent of an inner join in SQL. Unmatched child logical iterations are removed from the [=child logical view=].

| Property                | Domain                | Range                 |
|-------------------------|-----------------------|-----------------------|
| `rml:leftJoin`          | `rml:LogicalView`     | `rml:LogicalViewJoin` |
| `rml:outerJoin`         | `rml:LogicalViewJoin` | `rml:LogicalViewJoin` |
| `rml:innerJoin`         | `rml:LogicalViewJoin` | `rml:LogicalViewJoin` |

### Logical view join examples

The following logical sources and parent logical view are used by all join examples in this section. The logical source `:csvSource` supplies data for the [=child logical view=], while `:jsonSource` supplies data for the [=parent logical view=] `:jsonView`.

<aside class="ex-input">

```csv
name,birthyear
alice,1995
bob,1999
tobias,2005
```

</aside>

<aside class="ex-input">

```json
{
  "people": [
    {
      "name": "alice",
      "items": [
        { "type": "sword", "weight": 1500 },
        { "type": "shield", "weight": 2500 }
      ]
    },
    {
      "name": "bob",
      "items": [
        { "type": "flower", "weight": 15 }
      ]
    },
    {
      "name": "carol",
      "items": [
        { "type": "book", "weight": 500 }
      ]
    }
  ]
}
```

</aside>

<aside class=ex-mapping>

```turtle
:csvSource a rml:LogicalSource ;
  rml:source :csvFile ;
  rml:referenceFormulation rml:CSV .

:jsonSource a rml:LogicalSource ;
  rml:source :jsonFile ;
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
```

</aside>

#### Left join

<aside class=example id=ex-leftjoin>

This example applies a [=left join=] between a [=child logical view=] built from `:csvSource` and the [=parent logical view=] `:jsonView`. The three matching pairs produce three logical iterations. The unmatched child logical iteration for `tobias` is retained with null values for the fields from the [=logical view join=], resulting in 4 logical iterations. The unmatched parent logical iteration for `carol` is not retained.

<aside class=ex-mapping>

```turtle

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
  ] .
```

</aside>

<aside class="ex-intermediate">
<table>
    <tr>
        <th><u>#</u></th>
        <th>&lt;it&gt;</th>
        <th><u>name.#</u></th>
        <th><u>name</u></th>
        <th><u>birthyear.#</u></th>
        <th><u>birthyear</u></th>
        <th><u>item_type.#</u></th>
        <th><u>item_type</u></th>
        <th><u>item_weight.#</u></th>
        <th><u>item_weight</u></th>
    </tr>
    <tr>
        <td>0</td>
        <td>(row)</td>
        <td>0</td>
        <td>alice</td>
        <td>0</td>
        <td>1995</td>
        <td>0</td>
        <td>sword</td>
        <td>0</td>
        <td>1500 </td>
    </tr>
    <tr>
        <td>0</td>
        <td>(row)</td>
        <td>0</td>
        <td>alice</td>
        <td>0</td>
        <td>1995</td>
        <td>1</td>
        <td>shield</td>
        <td>1</td>
        <td>2500 </td>
    </tr>
    <tr>
        <td>1</td>
        <td>(row)</td>
        <td>0</td>
        <td>bob</td>
        <td>0</td>
        <td>1999</td>
        <td>0</td>
        <td>flower</td>
        <td>0</td>
        <td>15 </td>
    </tr>
    <tr>
        <td>2</td>
        <td>(row)</td>
        <td>0</td>
        <td>tobias</td>
        <td>0</td>
        <td>2005</td>
        <td>null</td>
        <td>null</td>
        <td>null</td>
        <td>null </td>
    </tr>
</table>

</aside>
</aside>

#### Outer join

<aside class=example id=ex-outerjoin>

This example applies an [=outer join=] between a [=child logical view=] built from `:csvSource` and the [=parent logical view=] `:jsonView`. The three matching pairs produce three logical iterations. The unmatched child logical iteration for `tobias` and the unmatched parent logical iteration for `carol` are both retained with null values for the fields from the other logical view, resulting in 5 logical iterations.

<aside class=ex-mapping>

```turtle
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
      rml:fieldName "item_type" ;
      rml:reference "item.type" ;
    ] ;
    rml:field [
      a rml:ExpressionField ;
      rml:fieldName "item_weight" ;
      rml:reference "item.weight" ;
    ] ;
  ] .
```

</aside>

<aside class="ex-intermediate">
<table>
    <tr>
        <th><u>#</u></th>
        <th>&lt;it&gt;</th>
        <th><u>name.#</u></th>
        <th><u>name</u></th>
        <th><u>birthyear.#</u></th>
        <th><u>birthyear</u></th>
        <th><u>p_name.#</u></th>
        <th><u>p_name</u></th>
        <th><u>item_type.#</u></th>
        <th><u>item_type</u></th>
        <th><u>item_weight.#</u></th>
        <th><u>item_weight</u></th>
    </tr>
    <tr>
        <td>0</td>
        <td>(row)</td>
        <td>0</td>
        <td>alice</td>
        <td>0</td>
        <td>1995</td>
        <td>0</td>
        <td>alice</td>
        <td>0</td>
        <td>sword</td>
        <td>0</td>
        <td>1500</td>
    </tr>
    <tr>
        <td>0</td>
        <td>(row)</td>
        <td>0</td>
        <td>alice</td>
        <td>0</td>
        <td>1995</td>
        <td>0</td>
        <td>alice</td>
        <td>1</td>
        <td>shield</td>
        <td>1</td>
        <td>2500</td>
    </tr>
    <tr>
        <td>1</td>
        <td>(row)</td>
        <td>0</td>
        <td>bob</td>
        <td>0</td>
        <td>1999</td>
        <td>0</td>
        <td>bob</td>
        <td>0</td>
        <td>flower</td>
        <td>0</td>
        <td>15</td>
    </tr>
    <tr>
        <td>2</td>
        <td>(row)</td>
        <td>0</td>
        <td>tobias</td>
        <td>0</td>
        <td>2005</td>
        <td>null</td>
        <td>null</td>
        <td>null</td>
        <td>null</td>
        <td>null</td>
        <td>null</td>
    </tr>
    <tr>
        <td>null</td>
        <td>null</td>
        <td>null</td>
        <td>null</td>
        <td>null</td>
        <td>null</td>
        <td>0</td>
        <td>carol</td>
        <td>0</td>
        <td>book</td>
        <td>0</td>
        <td>500</td>
    </tr>
</table>

</aside>
</aside>

#### Inner join

<aside class=example id=ex-innerjoin>

This example applies an [=inner join=] between a [=child logical view=] built from `:csvSource` and the [=parent logical view=] `:jsonView`. The three matching pairs produce three logical iterations. The unmatched child logical iteration for `tobias` and the unmatched parent logical iteration for `carol` are not retained, resulting in 3 logical iterations.

<aside class=ex-mapping>

```turtle
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
    rml:parentLogicalView :jsonView
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
```

</aside>

<aside class="ex-intermediate">
<table>
    <tr>
        <th><u>#</u></th>
        <th>&lt;it&gt;</th>
        <th><u>name.#</u></th>
        <th><u>name</u></th>
        <th><u>birthyear.#</u></th>
        <th><u>birthyear</u></th>
        <th><u>item_type.#</u></th>
        <th><u>item_type</u></th>
        <th><u>item_weight.#</u></th>
        <th><u>item_weight</u></th>
    </tr>
    <tr>
        <td>0</td>
        <td>(row)</td>
        <td>0</td>
        <td>alice</td>
        <td>0</td>
        <td>1995</td>
        <td>0</td>
        <td>sword</td>
        <td>0</td>
        <td>1500 </td>
    </tr>
    <tr>
        <td>0</td>
        <td>(row)</td>
        <td>0</td>
        <td>alice</td>
        <td>0</td>
        <td>1995</td>
        <td>1</td>
        <td>shield</td>
        <td>1</td>
        <td>2500 </td>
    </tr>
    <tr>
        <td>1</td>
        <td>(row)</td>
        <td>0</td>
        <td>bob</td>
        <td>0</td>
        <td>1999</td>
        <td>0</td>
        <td>flower</td>
        <td>0</td>
        <td>15 </td>
    </tr>
</table>

</aside>
</aside>

#### Two left joins

<aside class=example id=ex-twoleftjoins>

In this example a second [=logical view join=] is added to the [=logical view=] from [[[#ex-leftjoin]]]. The [=parent logical view=] of this second join is derived from logical source `:additionalCsvSource` with below input data.
<aside class=ex-input>

```csv
name,id
alice,123
bob,456
tobias,789
```

</aside>

<aside class=ex-mapping>

```turtle
:additionalCsvView a rml:LogicalView ;
  rml:viewOn :additioncalCsvSource ;
  rml:field [
    a rml:ExpressionField ;
    rml:fieldName "name" ;
    rml:reference "name" ;
  ] ;
  rml:field [
    a rml:ExpressionField ;
    rml:fieldName "id" ;
    rml:reference "id" ;
  ] . 

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
```

</aside>

<aside class="ex-intermediate">
<table>
    <tr>
        <th><u>#</u></th>
        <th><&lt;it&gt;</th>
        <th><u>name.#</u></th>
        <th><u>name</u></th>
        <th><u>birthyear.#</u></th>
        <th><u>birthyear</u></th>
        <th><u>item_type.#</u></th>
        <th><u>item_type</u></th>
        <th><u>item_weight.#</u></th>
        <th><u>item_weight</u></th>
        <th><u>id.#</u></th>
        <th><u>id</u></th>
    </tr>
    <tr>
        <td>0</td>
        <td>(row)</td>
        <td>0</td>
        <td>alice</td>
        <td>0</td>
        <td>1995</td>
        <td>0</td>
        <td>sword</td>
        <td>0</td>
        <td>1500 </td>
        <td>0</td>
        <td>123</td>
    </tr>
    <tr>
        <td>0</td>
        <td>(row)</td>
        <td>0</td>
        <td>alice</td>
        <td>0</td>
        <td>1995</td>
        <td>1</td>
        <td>shield</td>
        <td>1</td>
        <td>2500 </td>
        <td>0</td>
        <td>123</td>
    </tr>
    <tr>
        <td>1</td>
        <td>(row)</td>
        <td>0</td>
        <td>bob</td>
        <td>0</td>
        <td>1999</td>
        <td>0</td>
        <td>flower</td>
        <td>0</td>
        <td>15 </td>
        <td>0</td>
        <td>456</td>
    </tr>
    <tr>
        <td>2</td>
        <td>(row)</td>
        <td>0</td>
        <td>tobias</td>
        <td>0</td>
        <td>2005</td>
        <td>null</td>
        <td>null</td>
        <td>null</td>
        <td>null </td>
        <td>0</td>
        <td>789</td>
    </tr>
</table>

</aside>
</aside>
