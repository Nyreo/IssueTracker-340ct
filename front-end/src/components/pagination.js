import React from 'react'

const Pagination = ({pagination, numberOfPages, setPagination}) => {
        let paginationDOM = []

        let min = (pagination - 1 < 0 ? 0 : pagination - 1);
        let max = (pagination + 1 >= numberOfPages ? numberOfPages - 1 : pagination + 1)

        for(let i = min; i <= max; i++) {
            const cn = (i===pagination ? 'item active' : 'item')
            paginationDOM.push(
                (<button className={cn} key={`btn_page${i}`} onClick={() => setPagination(i)}>{i}</button>)
            )
        }

        return (
            <div className='pagination'>
                {paginationDOM}
            </div>
        )
    }

export default Pagination