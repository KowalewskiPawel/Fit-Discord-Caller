### Active Minutes

#### Req Body

```
{
  "aggregateBy": [{
    "dataTypeName": "com.google.active_minutes",
    "dataSourceId": "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes"
  }],
  "bucketByTime": { "durationMillis": 86400000 },
  "startTimeMillis": 1678406400000,
  "endTimeMillis":1678579200000
}
```

#### URL

`https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`

Type: **POST**

### Steps

#### Req Body

```
{
  "aggregateBy": [{
    "dataTypeName": "com.google.step_count.delta",
    "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
  }],
  "bucketByTime": { "durationMillis": 86400000 },
  "startTimeMillis": 1678406400000,
  "endTimeMillis":1678579200000
}
```

#### URL

`https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`

Type: **POST**