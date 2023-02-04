function DebugContainer({children, data}) {

	return (
		<div className='debug' onClick={() => navigator.clipboard.writeText(data)}>
			{children}
		</div>
	)
  }
  
  export default DebugContainer