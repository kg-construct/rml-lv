## Joins {#joins}

A <dfn>join</dfn> (`rml:Join`) is an operation that extends the logical iteration of one logical view (the child logical view) with fields from another logical view (the parent logical view).

A [=join=] (`rml:Join`) MUST contain:
- exactly one parent logical view property (`rml:parentLogicalView`), whose value is a [=logical view=] (`rml:LogicalView`) that supplies the additional fields.
- at least one join condition property (`rml:joinCondition`), whose value is a [=join condition=] that describe which values are compared to join the two logical views.
- at least one field property (`rml:field`), whose value is a [=field=] (`rml:Field`) . This field MAY only contain references to fields that exists in the parent logical view. 

| Property                | Domain     | Range               |
|-------------------------|------------|---------------------|
| `rml:parentLogicalView` | `rml:Join` | `rml:LogicalView`   |
| `rml:joinCondition`     | `rml:Join` | `rml:JoinCondition` |
| `rml:field`             | `rml:Join` | `rml:Field`         |


### Join conditions

A <dfn>join condition</dfn> is represented by a resource that MUST contain exactly one value for each of the following two properties:

- a <dfn>child map</dfn> (`rml:childMap`), whose value is an [Expression Map](https://kg-construct.github.io/rml-core/spec/docs/#expression-map-rml-expressionmap) (`rml:ExpressionMap`),
  which MUST include references that exist in the child logical view, or it should have a constant value.

- a <dfn>parent map</dfn> (`rml:parentMap`), whose value is an [Expression Map](https://kg-construct.github.io/rml-core/spec/docs/#expression-map-rml-expressionmap) (`rml:ExpressionMap`),
  which, as the join condition's parent map, MUST include references that exist in the logical view specified by the parent logical view property, or it should have a constant value.

The [=join condition=] returns true when values produced by the child map and the parent map during the iteration are equal.
<aside class="note">
If no data type is specified in the field, string values are compared.
Data types are not taken into account. 
`1.0` will not match with `1.00`. 
To secure this match a transformation with <a href="https://kg-construct.github.io/rml-fnml/ontology/documentation/index-en.html">RML-FNML:Functions</a> needs to be configured. 
TODO describe what happens if the data types are deduced from the source (refer to the description that will be added to rml:core? 
</aside>

<aside class="note">
This definition is in line with the definition in RML CORE, with one small difference: it refers directly to a parent logicial source, and not to the logical source of the parent triples map.
</aside>

| Property                    | Domain               | Range                     |
| --------------------------- | -------------------- | ------------------------- |
| `rml:childMap`              | `rml:JoinCondition`  | `rml:ExpressionMap`       |
| `rml:parentMap`             | `rml:JoinCondition`  | `rml:ExpressionMap`       |

#### Shortcuts

If the value of the [=child map=] property (`rml:childMap`) is a [reference-valued Expression Map](https://kg-construct.github.io/rml-core/spec/docs/#reference-rml-reference),
then the `rml:child` shortcut could be used.

Similarly, if value of the [=parent map=] (`rml:parentMap`) is a [reference-valued Expression Map](https://kg-construct.github.io/rml-core/spec/docs/#reference-rml-reference),
then the `rml:parent` shortcut could be used.

| Property                    | Domain               | Range                     |
| --------------------------- | -------------------- | ------------------------- |
| `rml:child`                 | `rml:JoinCondition`  | `Literal`                 |
| `rml:parent`                | `rml:JoinCondition`  | `Literal`                 |

<aside class="issue">
Els: or can we just refer to rml core and not specify any definitions here?
</aside>
<aside class="issue">
Els: can we also optionally declare a join function here, to allow not only equijoins (default) but also other joins
</aside>

### Join types {#dfn-join-type}

A [=logical view=] (`rml:LogicalView`) MAY have one or more with join properties, specifying the join type, i.e. a [=left join=] and a [=inner join=].

A <dfn>left join</dfn> (`rml:leftJoin`) is the equivalent of a left (outer) join in SQL, where the child logical view is the left part of the join, and the parent logical view is the right part of the join.
After the join operation all logical iterations of the child logical view are kept.
These logical iterations are extended with fields from the parent logical view when a match is found that meets the join conditions.
When more than one logical iteration in the parent logical view matches with a logical iteration in the child logical view, each match leads to an additional extended logical iteration.
If no match is found, the added field in that extended logical iteration contains a null value.

A <dfn>inner join</dfn> (`rml:innerJoin`) is the equivalent of an inner join in SQL.
The logical iterations from the child logical view are extended with values from the parent logical view when a match is found that meets the join conditions.
When more than one logical iteration in the parent logical view matches with a logical iteration in the child logical view, each match leads to an additional extended logical iteration.
If no match is found for a logical iteration, the logical iteration is removed from the child logical view.

### Join examples
<aside class="issue">
Pano please verify what I did with the iterator and # key from the parent logical view. Is this ok? This should still be described somewhere?
</aside>
<aside class="issue">
Els: TODO add example with 2 joins???
</aside>

### Left join
<aside class=example id=ex-leftjoin>

In this example a [=logical view=] with fields built with data from the logical source form [[[#csviterator]]] is joined with the logical view from [[[#ex-field-record-sequence]]]. 
In case of a left join (as in the example), this results in 4 logical iterations in the logical view. 
If an inner joins would have been used, the logical view would have only 3 logical iterations. 

<aside class=ex-mapping>

```turtle
:csvView a rml:LogicalView ;
  rml:logicalSource :csvSource ;
  rml:field [
    rml:fieldName "name" ;
    rml:reference "name" ;
  ] ;
  rml:field [
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
      rml:fieldName "item_type" ;
      rml:reference "item.type" ;
    ] ;
    rml:field [
      rml:fieldName "item_weight" ;
      rml:reference "item.weight" ;
    ] ;
  ] .
```

</aside>

<aside class="ex-intermediate">
<table>
    <tr>
        <td>#</td>
        <td>&lt;it&gt;</td>
        <td>name.#</td>
        <td>name</td>
        <td>birthyear.#</td>
        <td>birthyear</td>
        <td>parent.#</td>
        <td>parent.&lt;it&gt;</td>
        <td>item_type.#</td>
        <td>item_type</td>
        <td>item_weight#</td>
        <td>item_weight </td>
    </tr>
    <tr>
        <td>0</td>
        <td>(row)</td>
        <td>0</td>
        <td>alice</td>
        <td>0</td>
        <td>1995</td>
        <td>0</td>
        <td>(fields)</td>
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
        <td>0</td>
        <td>(fields)</td>
        <td>1</td>
        <td>shield</td>
        <td>1</td>
        <td>2500 </td>
    </tr>
    <tr>
        <td>1</td>
        <td>(row)</td>
        <td>1</td>
        <td>bob</td>
        <td>1</td>
        <td>1999</td>
        <td>1</td>
        <td>(fields)</td>
        <td>2</td>
        <td>flower</td>
        <td>2</td>
        <td>15 </td>
    </tr>
    <tr>
        <td>2</td>
        <td>(row)</td>
        <td>2</td>
        <td>tobias</td>
        <td>2</td>
        <td>2005</td>
        <td>null</td>
        <td>null</td>
        <td>null</td>
        <td>null</td>
        <td>null</td>
        <td>null </td>
    </tr>
</table>

</aside>
</aside>

### Inner join
<aside class=example id=ex-innerjoin>

When an inner join is used, the resulting logical view has only 3 logical iterations.

<aside class=ex-mapping>

```turtle
:csvView a rml:LogicalView ;
  rml:logicalSource :csvSource ;
  rml:field [
    rml:fieldName "name" ;
    rml:reference "name" ;
  ] ;
  rml:field [
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
      rml:fieldName "item_type" ;
      rml:reference "item.type" ;
    ] ;
    rml:field [
      rml:fieldName "item_weight" ;
      rml:reference "item.weight" ;
    ] ;
  ] .
```

</aside>

<aside class="ex-intermediate">
<table>
    <tr>
        <td>#</td>
        <td>&lt;it&gt;</td>
        <td>name.#</td>
        <td>name</td>
        <td>birthyear.#</td>
        <td>birthyear</td>
        <td>parent.#</td>
        <td>parent.&lt;it&gt;</td>
        <td>item_type.#</td>
        <td>item_type</td>
        <td>item_weight#</td>
        <td>item_weight </td>
    </tr>
    <tr>
        <td>0</td>
        <td>(row)</td>
        <td>0</td>
        <td>alice</td>
        <td>0</td>
        <td>1995</td>
        <td>0</td>
        <td>(fields)</td>
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
        <td>0</td>
        <td>(fields)</td>
        <td>1</td>
        <td>shield</td>
        <td>1</td>
        <td>2500 </td>
    </tr>
    <tr>
        <td>1</td>
        <td>(row)</td>
        <td>1</td>
        <td>bob</td>
        <td>1</td>
        <td>1999</td>
        <td>1</td>
        <td>(fields)</td>
        <td>2</td>
        <td>flower</td>
        <td>2</td>
        <td>15 </td>
    </tr>
</table>

</aside>
</aside>
