# PartnershipsApi

All URIs are relative to *http://localhost:3001*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiPartnershipsGet**](#apipartnershipsget) | **GET** /api/partnerships | パートナーシップ一覧取得|
|[**apiPartnershipsIdPut**](#apipartnershipsidput) | **PUT** /api/partnerships/{id} | パートナーシップ応答|
|[**apiPartnershipsPost**](#apipartnershipspost) | **POST** /api/partnerships | パートナーシップリクエスト送信|

# **apiPartnershipsGet**
> Array<Partnership> apiPartnershipsGet()

自分に関連するパートナーシップリクエストを取得

### Example

```typescript
import {
    PartnershipsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PartnershipsApi(configuration);

const { status, data } = await apiInstance.apiPartnershipsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Partnership>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | パートナーシップ一覧取得成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiPartnershipsIdPut**
> Partnership apiPartnershipsIdPut(partnershipUpdateRequest)

受信したパートナーシップリクエストに応答（承認/拒否）

### Example

```typescript
import {
    PartnershipsApi,
    Configuration,
    PartnershipUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PartnershipsApi(configuration);

let id: string; //パートナーシップID (default to undefined)
let partnershipUpdateRequest: PartnershipUpdateRequest; //

const { status, data } = await apiInstance.apiPartnershipsIdPut(
    id,
    partnershipUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partnershipUpdateRequest** | **PartnershipUpdateRequest**|  | |
| **id** | [**string**] | パートナーシップID | defaults to undefined|


### Return type

**Partnership**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 応答成功 |  -  |
|**403** | 他人のリクエストには応答できない |  -  |
|**404** | パートナーシップが見つからない |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiPartnershipsPost**
> Partnership apiPartnershipsPost(partnershipCreateRequest)

他のユーザーにパートナーシップリクエストを送信

### Example

```typescript
import {
    PartnershipsApi,
    Configuration,
    PartnershipCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PartnershipsApi(configuration);

let partnershipCreateRequest: PartnershipCreateRequest; //

const { status, data } = await apiInstance.apiPartnershipsPost(
    partnershipCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partnershipCreateRequest** | **PartnershipCreateRequest**|  | |


### Return type

**Partnership**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | リクエスト送信成功 |  -  |
|**422** | バリデーションエラー |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

