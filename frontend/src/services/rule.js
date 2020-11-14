import request from '@/utils/request';

export async function queryRule(params) {
    return request('/api/query_mock_records', {
        method: 'POST',
        data: { ...params, method: 'post' },
    });
}
