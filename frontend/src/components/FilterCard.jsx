import { useState } from 'react'
import './FilterCard.css'

const filterData = [
  {
    filterType: 'Location',
    array: ['Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai']
  },
  {
    filterType: 'Industry',
    array: ['Frontend Developer', 'Backend Developer', 'FullStack Developer']
  },
  {
    filterType: 'Salary',
    array: ['0-40k', '42-1lakh', '1lakh to 5lakh']
  }
]

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('')

  const changeHandler = (value) => {
    setSelectedValue(value)
  }

  return (
    <div className="filter-card">

      <h2>Filter Jobs</h2>

      <hr />

      {filterData.map((data, index) => (
        <div className="filter-group" key={data.filterType}>

          <h3>{data.filterType}</h3>

          {data.array.map((item, idx) => {
            const itemId = `filter-${index}-${idx}`

            return (
              <div className="filter-option" key={item}>

                <input
                  type="radio"
                  id={itemId}
                  name="job-filter"
                  value={item}
                  checked={selectedValue === item}
                  onChange={() => changeHandler(item)}
                />

                <label htmlFor={itemId}>
                  {item}
                </label>

              </div>
            )
          })}

        </div>
      ))}

    </div>
  )
}

export default FilterCard