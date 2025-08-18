# UsersApi

All URIs are relative to *http://localhost:3001*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiUsersProfileGet**](#apiusersprofileget) | **GET** /api/users/profile | プロフィール取得|
|[**apiUsersProfilePut**](#apiusersprofileput) | **PUT** /api/users/profile | プロフィール更新|

# **apiUsersProfileGet**
> User apiUsersProfileGet()

認証ユーザーのプロフィール情報を取得

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.apiUsersProfileGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**User**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | プロフィール取得成功 |  -  |
|**401** | 未認証 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiUsersProfilePut**
> User apiUsersProfilePut(userUpdateRequest)

認証ユーザーのプロフィール情報を更新

### Example

```typescript
import {
    UsersApi,
    Configuration,
    UserUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userUpdateRequest: UserUpdateRequest; //

const { status, data } = await apiInstance.apiUsersProfilePut(
    userUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userUpdateRequest** | **UserUpdateRequest**|  | |


### Return type

**User**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | プロフィール更新成功 |  -  |
|**422** | バリデーションエラー |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

