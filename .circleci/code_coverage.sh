#!/usr/bin/env bash

WORK_DIR=$PWD

export EXISTING_BRANCHES=$(git branch -r | perl -lne '@parts=split("/",$_); print @parts[1]')

# clone gitlab coverage repo
cd /tmp
git clone https://$GITLAB_TOKEN_NAME:$GITLAB_ACCESS_TOKEN@gitlab.com/leverj/reactor-js.git
cd /tmp/reactor

# create branch directory in coverage folder if it does not exist
mkdir -p /tmp/reactor/coverage/$CIRCLE_BRANCH

# clean previous covergae report
rm -rf /tmp/reactor/coverage/$CIRCLE_BRANCH/*

# copy new coverage report
cp -R $WORK_DIR/coverage/* /tmp/reactor/coverage/$CIRCLE_BRANCH
echo '{' > /tmp/reactor/coverage/$CIRCLE_BRANCH/commit-info.json
echo "  \"user\":\"$CIRCLE_USERNAME\"," >> /tmp/reactor/coverage/$CIRCLE_BRANCH/commit-info.json
echo "  \"branch\":\"$CIRCLE_BRANCH\"," >> /tmp/reactor/coverage/$CIRCLE_BRANCH/commit-info.json
echo "  \"github\":\"https://github.com/leverj/reactor-js/commit/$CIRCLE_SHA1\"," >> /tmp/reactor/coverage/$CIRCLE_BRANCH/commit-info.json
echo "  \"circle-ci\":\"https://app.circleci.com/pipelines/github/leverj/reactor-js/$PIPELINE_NUMBER\"" >> /tmp/reactor/coverage/$CIRCLE_BRANCH/commit-info.json
echo '}' >> /tmp/reactor/coverage/$CIRCLE_BRANCH/commit-info.json

# find all branches in github/reactor repo
cd /tmp/reactor/coverage
export DIRECTORIES=$(ls -l | perl -lane 'print @F[$#F] if (/^d.*/)')

# find extra directories in gitlab/coverage repo, which do not exists in github/reactor branches
TO_BE_DELETED=$(
perl<<'FIND_DELETED'
  use Env qw($EXISTING_BRANCHES $DIRECTORIES);
  my @directories = split(' ', $DIRECTORIES);
  my %branches = map {$_ => 1 } split(' ', $EXISTING_BRANCHES);
  my @to_be_deleted = grep {! $branches{$_}} @directories;
  print "@to_be_deleted";
FIND_DELETED
)

#delete directories corresponding to deleted branches
for _each in $TO_BE_DELETED; do
  rm -rf /tmp/reactor/coverage/$_each
done



#publish to gitlab
cd /tmp/reactor
  git add --all
  git config user.name "nirmalgupta"
  git config user.email "nirmal@leverj.io"
  git commit -a -m"user: $CIRCLE_USERNAME, branch: $CIRCLE_BRANCH, github: https://github.com/leverj/reactor-js/commit/$CIRCLE_SHA1, circle-ci: https://app.circleci.com/pipelines/github/leverj/reactor-js/$PIPELINE_NUMBER"
  git push
