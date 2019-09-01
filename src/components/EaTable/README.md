### table 属性

|     属性      |              说明              |                 类型                  | 默认值 |
| :-----------: | :----------------------------: | :-----------------------------------: | :----: |
|    rowKey     |       表格行 key 的取值        |                string                 |  key   |
|    fullId     |      全屏指定的 elementId      |                string                 |   -    |
|   totalInfo   |          统计条的内容          |           string,ReactNode            |   -    |
|    loading    |         页面是否加载中         |                boolean                | false  |
|    columns    |        表格列的配置描述        |                 any[]                 |   []   |
|  dataSource   |            数据数组            |                 any[]                 |   []   |
|    current    |             当前页             |                number                 |   0    |
|   pageSize    |          页面数据长度          |                number                 |   20   |
|     count     |           数据总长度           |                number                 |   0    |
| getSelectData | 异步获取过滤或编辑所需额外数据 |       Function(type, field, cb)       |   -    |
| onChangeValue |          异步编辑接口          |    Function(key, field, value, cb)    |   -    |
|   onChange    |   分页、排序、筛选变化时触发   | Function(pagination, filters, sorter) |   -    |

### columns 新增属性

##### 支持原 antd table column 属性

##### 禁用字段 onHeaderCell onCell filterDropdown filterIcon onFilterDropdownVisibleChange

|        属性         |                         说明                         |          类型          | 默认值 |
| :-----------------: | :--------------------------------------------------: | :--------------------: | :----: |
|        type         |                      单元格类型                      |         string         |   -    |
|       showKey       |        当数据类型是对象时, 用来显示的字段 key        |         string         |   -    |
|      dataType       |                       数据类型                       |         string         |   -    |
|         id          |           当 dataType 为 find 时, 数据 id            |         string         |   -    |
|       findKey       |         当 dataType 为 find 时, 查找数据字段         |         string         |   -    |
|     headerType      |                      列表头类型                      |         string         |   -    |
|       filter        |                     是否启用过滤                     |        boolean         | false  |
|    filterDefault    |                      过滤默认值                      |          any           |   -    |
|     filterType      |                      列过滤类型                      |         string         |   -    |
|   filterAllowAdd    |     当 filterType 为 serch 时, 是否允许添加选项      |        boolean         | false  |
|  filterCheckboxAll  |      当 filterType 为 checkbox 时, 是否允许全部      |        boolean         | false  |
|    filterExtend     |                   是否启动过滤扩展                   |        boolean         | false  |
|  filterExtendType   |                     过滤扩展类型                     |         string         |   -    |
| filterExtendDefault |                    过滤扩展默认值                    |          any           |   -    |
|      editType       |                    单元格编辑类型                    |         string         |   -    |
|    editAllowAdd     | 当 editType 为 auto 或 checkbox 时, 是否允许添加选项 |        boolean         | false  |
|      minWidth       |                     列的最小宽度                     |         number         |   -    |
|      getValue       |                    自定义编辑的值                    | Function(column, data) |   -    |
|      getLabel       |                   自定义显示的文本                   | Function(column, data) |   -    |

### type

| 值  |   说明   |
| :-: | :------: |
| tag | 标签显示 |

### dataType

|  值  |   说明   |
| :--: | :------: |
| find | 查找数据 |

### headerType

|    值    |                                                         说明                                                          |
| :------: | :-------------------------------------------------------------------------------------------------------------------: |
| compact  |                                              紧凑显示 过滤标识最小化显示                                              |
| vertical | 垂直显示 根据字数长短改变尺寸 1-2: 大小 12 间距 18, 3-4: 大小 12 间距 14, 5-: 大小 10 间距 12, (垂直显示包含紧凑显示) |

### filterType

|       值       |               说明                |
| :------------: | :-------------------------------: |
|     input      |             普通输入              |
|     search     | 搜索标签类 (会触发 getSelectData) |
|    checkbox    |   多选类 (会触发 getSelectData)   |
| searchCheckbox | 搜索多选类 (会触发 getSelectData) |
|     radio      |   单选类 (会触发 getSelectData)   |

### editType

|    值    |              说明               |
| :------: | :-----------------------------: |
|  input   |            普通输入             |
|  number  |            数字输入             |
|   auto   | 自动补全 (会触发 getSelectData) |
| checkbox |   多选 (会触发 getSelectData)   |
|  radio   |   单选 (会触发 getSelectData)   |

### filterExtendType

|  值   |             说明              |
| :---: | :---------------------------: |
| radio | 单选类 (会触发 getSelectData) |
