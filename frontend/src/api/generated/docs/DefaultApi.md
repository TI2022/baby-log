# DefaultApi

All URIs are relative to *http://localhost:3001*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**rootGet**](#rootget) | **GET** / | API ヘルスチェック|

# **rootGet**
> Get200Response rootGet()

APIサーバーの稼働状況を確認

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.rootGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Get200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | API稼働中 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

