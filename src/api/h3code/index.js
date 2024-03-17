import request from '@/utils/request'

export  function latLngCellToBoundary(data){
    return new request({
        url: '/uber/h3/latLngCellToBoundary',
        data,
        method: 'post',
    });
}
