# Record


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**user_id** | **string** |  | [optional] [default to undefined]
**type** | [**RecordType**](RecordType.md) |  | [optional] [default to undefined]
**timestamp** | **string** |  | [optional] [default to undefined]
**metadata** | **object** | 記録タイプに応じたメタデータ | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Record } from './api';

const instance: Record = {
    id,
    user_id,
    type,
    timestamp,
    metadata,
    created_at,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
