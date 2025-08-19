# AuthApi

All URIs are relative to *http://localhost:3001*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAuthLoginPost**](#apiauthloginpost) | **POST** /api/auth/login | ログイン|
|[**apiAuthLogoutDelete**](#apiauthlogoutdelete) | **DELETE** /api/auth/logout | ログアウト|
|[**apiAuthMeGet**](#apiauthmeget) | **GET** /api/auth/me | 認証ユーザー情報取得|
|[**apiAuthRegisterPost**](#apiauthregisterpost) | **POST** /api/auth/register | ユーザー登録|

# **apiAuthLoginPost**
> AuthResponse apiAuthLoginPost(userLoginRequest)

メールアドレスとパスワードでログインし、JWTトークンを返す

### Example

```typescript
import {
    AuthApi,
    Configuration,
    UserLoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let userLoginRequest: UserLoginRequest; //

const { status, data } = await apiInstance.apiAuthLoginPost(
    userLoginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userLoginRequest** | **UserLoginRequest**|  | |


### Return type

**AuthResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ログイン成功 |  -  |
|**401** | 認証失敗 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAuthLogoutDelete**
> apiAuthLogoutDelete()

JWTトークンを無効化

### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.apiAuthLogoutDelete();
```

### Parameters
This endpoint does not have any parameters.


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
|**204** | ログアウト成功 |  -  |
|**401** | 未認証 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAuthMeGet**
> User apiAuthMeGet()

現在認証中のユーザー情報を取得

### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.apiAuthMeGet();
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
|**200** | ユーザー情報取得成功 |  -  |
|**401** | 未認証 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAuthRegisterPost**
> AuthResponse apiAuthRegisterPost(userRegistrationRequest)

新規ユーザーを登録し、JWTトークンを返す

### Example

```typescript
import {
    AuthApi,
    Configuration,
    UserRegistrationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let userRegistrationRequest: UserRegistrationRequest; //

const { status, data } = await apiInstance.apiAuthRegisterPost(
    userRegistrationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userRegistrationRequest** | **UserRegistrationRequest**|  | |


### Return type

**AuthResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 登録成功 |  -  |
|**422** | バリデーションエラー |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

