# RecordsApi

All URIs are relative to *http://localhost:3001*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiRecordsGet**](#apirecordsget) | **GET** /api/records | 育児記録一覧取得|
|[**apiRecordsIdDelete**](#apirecordsiddelete) | **DELETE** /api/records/{id} | 育児記録削除|
|[**apiRecordsIdGet**](#apirecordsidget) | **GET** /api/records/{id} | 育児記録詳細取得|
|[**apiRecordsIdPut**](#apirecordsidput) | **PUT** /api/records/{id} | 育児記録更新|
|[**apiRecordsPost**](#apirecordspost) | **POST** /api/records | 育児記録作成|

# **apiRecordsGet**
> RecordListResponse apiRecordsGet()

認証ユーザーの育児記録とパートナーの記録を取得

### Example

```typescript
import {
    RecordsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecordsApi(configuration);

let page: number; //ページ番号 (optional) (default to 1)
let perPage: number; //1ページあたりの件数 (optional) (default to 20)
let type: RecordType; //記録タイプでフィルタ (optional) (default to undefined)
let dateFrom: string; //開始日（YYYY-MM-DD） (optional) (default to undefined)
let dateTo: string; //終了日（YYYY-MM-DD） (optional) (default to undefined)

const { status, data } = await apiInstance.apiRecordsGet(
    page,
    perPage,
    type,
    dateFrom,
    dateTo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | ページ番号 | (optional) defaults to 1|
| **perPage** | [**number**] | 1ページあたりの件数 | (optional) defaults to 20|
| **type** | **RecordType** | 記録タイプでフィルタ | (optional) defaults to undefined|
| **dateFrom** | [**string**] | 開始日（YYYY-MM-DD） | (optional) defaults to undefined|
| **dateTo** | [**string**] | 終了日（YYYY-MM-DD） | (optional) defaults to undefined|


### Return type

**RecordListResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 記録一覧取得成功 |  -  |
|**401** | 未認証 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiRecordsIdDelete**
> apiRecordsIdDelete()

指定したIDの育児記録を削除（自分の記録のみ削除可能）

### Example

```typescript
import {
    RecordsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecordsApi(configuration);

let id: string; //記録ID (default to undefined)

const { status, data } = await apiInstance.apiRecordsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | 記録ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | 記録削除成功 |  -  |
|**403** | 他人の記録は削除できない |  -  |
|**404** | 記録が見つからない |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiRecordsIdGet**
> Record apiRecordsIdGet()

指定したIDの育児記録を取得

### Example

```typescript
import {
    RecordsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecordsApi(configuration);

let id: string; //記録ID (default to undefined)

const { status, data } = await apiInstance.apiRecordsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | 記録ID | defaults to undefined|


### Return type

**Record**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 記録取得成功 |  -  |
|**404** | 記録が見つからない |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiRecordsIdPut**
> Record apiRecordsIdPut(recordUpdateRequest)

指定したIDの育児記録を更新（自分の記録のみ更新可能）

### Example

```typescript
import {
    RecordsApi,
    Configuration,
    RecordUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RecordsApi(configuration);

let id: string; //記録ID (default to undefined)
let recordUpdateRequest: RecordUpdateRequest; //

const { status, data } = await apiInstance.apiRecordsIdPut(
    id,
    recordUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recordUpdateRequest** | **RecordUpdateRequest**|  | |
| **id** | [**string**] | 記録ID | defaults to undefined|


### Return type

**Record**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 記録更新成功 |  -  |
|**403** | 他人の記録は更新できない |  -  |
|**404** | 記録が見つからない |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiRecordsPost**
> Record apiRecordsPost(recordCreateRequest)

新しい育児記録を作成

### Example

```typescript
import {
    RecordsApi,
    Configuration,
    RecordCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RecordsApi(configuration);

let recordCreateRequest: RecordCreateRequest; //

const { status, data } = await apiInstance.apiRecordsPost(
    recordCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recordCreateRequest** | **RecordCreateRequest**|  | |


### Return type

**Record**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 記録作成成功 |  -  |
|**422** | バリデーションエラー |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

