source 'https://rubygems.org'
git source(:github) do |repo_name|
        repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
        "https://github.com/#{repo_name}.git"
end

gem 'rake'
gem 'aws_s3_website_sync', tag: '1.01.'
gem 'dotenv', groups: [:development, :test]