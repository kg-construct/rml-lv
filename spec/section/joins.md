## Logical view joins {#viewjoins}

A <dfn>logical view join</dfn> (`rml:LogicalViewJoin`) is an operation that extends the logical iteration of one logical view (the [=child logical view=]) with fields derived from another logical view (the [=parent logical view=]),
using a <a data-cite="RML-Core#dfn-join-condition">join condition</a>.

A [=logical view join=] MUST contain:
- exactly one parent logical view property (`rml:parentLogicalView`), whose value is a [=logical view=] (`rml:LogicalView`) that supplies the additional fields. This is referred to as the <dfn>parent logical view</dfn>.
- at least one join condition property (`rml:joinCondition`), whose value is a <a data-cite="RML-Core#dfn-join-condition">join condition</a>.
- at least one field property (`rml:field`), whose value is an [=expression field=] (`rml:ExpressionField`). This field SHOULD only contain [=logical view references=] that can be evaluated on the parent logical view. 

Similar to how  <a data-cite="RML-Core#joins">joins are defined in RML-Core</a>,
the [=logical view=] in the subject position of the [=join property=] fulfills the role of <!-- TODO reference to core child logical source when available-->[child logical source]() in the <a data-cite="RML-Core#dfn-join-condition">join condition(s)</a>, but of the [=logical view join=], and is referred to as <dfn>child logical view</dfn>.
The [=parent logical view=] fulfills the role of the <!-- TODO reference to core parent logical source when available-->[parent logical source]() in the <a data-cite="RML-Core#dfn-join-condition">join condition(s)</a>, but of the [=logical view join=].

| Property                | Domain                | Range                 |
|-------------------------|-----------------------|-----------------------|
| `rml:parentLogicalView` | `rml:LogicalViewJoin` | `rml:LogicalView`     |
| `rml:joinCondition`     | `rml:LogicalViewJoin` | `rml:Join`            |
| `rml:field`             | `rml:LogicalViewJoin` | `rml:ExpressionField` |

### Join types {#dfn-join-type}

The <dfn>join property</dfn> specifies the join type of the [=logical view join=], i.e. a [=left join=] or an [=inner join=].

A <dfn>left join</dfn> (`rml:leftJoin`) is the equivalent of a left (outer) join in SQL, where the [=child logical view=] is the left part of the join, and the [=parent logical view=] is the right part of the join. If any of the <a data-cite="RML-Core#dfn-join-condition">join conditions</a> evaluates to `false`, the fields from the [=logical view join=] in the extended logical iteration contain a null value.

An <dfn>inner join</dfn> (`rml:innerJoin`) is the equivalent of an inner join in SQL. If any of the <a data-cite="RML-Core#dfn-join-condition">join conditions</a> evaluates to `false`, the logical iteration is removed from the [=child logical view=].

### Logical view join examples

#### Left join

<aside class=example id=ex-leftjoin>

In this example a [=logical view=] with fields built with data from the logical source `:csvSource` is joined with the logical view from [[[#ex-field-record-sequence]]]. 
In case of a left join (as in the example), this results in 4 logical iterations in the logical view. 
If an inner joins would have been used, the logical view would have only 3 logical iterations. 

<aside class="ex-input">

```csv
name,birthyear
alice,1995
bob,1999
tobias,2005
```

</aside>

<aside class=ex-mapping>

```turtle
:csvSource a rml:LogicalSource ;
  rml:source :csvFile ;
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

#### Inner join
<aside class=example id=ex-innerjoin>

When an inner join is used, the resulting logical view has only 3 logical iterations.

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
