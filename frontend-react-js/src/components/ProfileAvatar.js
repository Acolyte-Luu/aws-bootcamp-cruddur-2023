import './ProfileAvatar.css';

export default function ProfileAvatar(props) {
  var backgroundImage = "none"
  if (props.id != null) {
    backgroundImage = `url("https://assets.acolyteluu.cloud/avatars/${props.id}.jpg")`
  }
    const styles = {
      backgroundImage: backgroundImage,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };

  return (
    <div 
    className="profile-avatar"
    style={styles}
    ></div>
  );
}