# RecordCreateRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | [**RecordType**](RecordType.md) |  | [default to undefined]
**timestamp** | **string** |  | [default to undefined]
**metadata** | **object** | 記録タイプに応じたメタデータ | [optional] [default to undefined]

## Example

```typescript
import { RecordCreateRequest } from './api';

const instance: RecordCreateRequest = {
    type,
    timestamp,
    metadata,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
