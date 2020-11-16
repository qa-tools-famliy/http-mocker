import request from '@/utils/request';

export async function queryRecord(params) {
    return request('/api/query_mock_records', {
        method: 'POST',
        data: { ...params },
    });
}
