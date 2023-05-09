import './ProfileHeading.css';
import EditProfileButton from '../components/EditProfileButton';
export default function ProfileHeading(props) {
    const backgroundImage = 'url("/workspace/aws-bootcamp-cruddur-2023/frontend-react-js/src/components/imgs")';
    const sytles = {
        backgroundImage: backgroundImage,
        backgroundSize:  'cover',
        backgroundPosition: center;


    }
  return (
    <div className='activity_feed_heading profile_heading'>
      <div className='title'>{props.profile.display_name}</div>
      <div class="cruds_count">{props.profile.cruds_count} Cruds</div>
      <div class="banner" style=styles>
      <div className='avatar'>
        <img src="https://assets.acolyteluu.cloud/avatars/data.jpg"></img>
      </div>

      <div className="display_name">{props.display_name}</div>
      <div className="handle">@{props.handle}</div>

      <EditProfileButton setPopped={props.setPopped}/>
  </div>
  );
}