import React from 'react'
import { Cropper } from 'react-cropper';
import { AiOutlineClose } from 'react-icons/ai';
import Button from '@mui/material/Button';

const ImgCropper = ({img, setCropper, setImg, cropData, getCropData}) => {
    console.log(img);

  return (
    <div className='cropper-box'>
        <div className='cropper-header'>
            <h4>Upload Photo</h4>
            <div className='close' onClick={() => setImg()}>
                <AiOutlineClose/>
            </div>
        </div>
        <div className='img-data'>
          <div className='img-preview'/>
        </div>
        <div className='cropp-img'>
          <Cropper
              style={{ height: 400, width: "100%"}}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={img}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              onInitialized={(instance) => {
                setCropper(instance)
              }}
              guides={true}
            />
        </div>
        <div className='img-crop' onClick={getCropData}>
          <Button variant="contained">Upload</Button>
        </div>
    </div>
  )
}

export default ImgCropper;
