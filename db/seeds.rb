# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require 'csv'    

AdminUser.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password')


csv_text = File.read('db/candidate_funding.csv')
csv = CSV.parse(csv_text, :headers => true)
csv.each do |row|
  Funding.create!(row.to_hash)
end